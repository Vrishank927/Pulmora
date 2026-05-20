import os
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

print("🔥 predictor.py LOADED FROM:", __file__)

# --------------------------------------------------
# Model paths
# --------------------------------------------------
BINARY_MODEL_PATH = os.path.join(
    settings.BASE_DIR, "core", "ml", "best_pulmora_model_BC.pt"
)

MULTI_MODEL_PATH = os.path.join(
    settings.BASE_DIR, "core", "ml", "best_pulmora_model_MC.pt"
)

_binary_model = None
_multi_model = None

# --------------------------------------------------
# Image Preprocessing (MUST match training)
# --------------------------------------------------
# Create NEW transform for each prediction to avoid any caching issues
def get_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])


def preprocess_image(image_path):
    """Preprocess image with fresh transform each time"""
    try:
        # Open image fresh each time
        image = Image.open(image_path)
        
        # Convert to RGB (handle grayscale, RGBA, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Apply transforms - create new tensor each time
        transform = get_transform()
        image_tensor = transform(image)
        
        # Add batch dimension - create NEW tensor
        image_tensor = image_tensor.unsqueeze(0).clone()
        
        logger.info(f"Image preprocessed: shape={image_tensor.shape}, path={image_path}")
        return image_tensor
        
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        raise


# --------------------------------------------------
# Binary model (TorchScript)
# --------------------------------------------------
def load_binary_model():
    global _binary_model
    if _binary_model is None:
        logger.info(f"Loading binary model from: {BINARY_MODEL_PATH}")
        _binary_model = torch.jit.load(
            BINARY_MODEL_PATH,
            map_location="cpu"
        )
        # Ensure model is in eval mode
        _binary_model.eval()
        # Set to train(False) then eval() to ensure all layers are properly set
        _binary_model.train(False)
        logger.info("Binary model loaded and set to eval mode")
    else:
        # Re-verify eval mode each time (in case of any state changes)
        _binary_model.eval()
        _binary_model.train(False)
    return _binary_model


# --------------------------------------------------
# Multi-class model (regular PyTorch)
# --------------------------------------------------
def load_multi_model():
    global _multi_model
    if _multi_model is None:
        logger.info(f"Loading multi-class model from: {MULTI_MODEL_PATH}")
        _multi_model = torch.load(
            MULTI_MODEL_PATH,
            map_location="cpu",
            weights_only=False
        )
        # Ensure model is in eval mode
        _multi_model.eval()
        # Set to train(False) then eval() to ensure all layers are properly set
        _multi_model.train(False)
        logger.info("Multi-class model loaded and set to eval mode")
    else:
        # Re-verify eval mode each time
        _multi_model.eval()
        _multi_model.train(False)
    return _multi_model


# --------------------------------------------------
# Severity Interpretation
# --------------------------------------------------
def interpret_severity_class(class_idx: int):
    mapping = {
        0: ("Mild", "Minimal lung involvement"),
        1: ("Moderate", "Moderate lung involvement"),
        2: ("Severe", "Severe lung involvement"),
    }
    return mapping.get(class_idx, ("Unknown", "Unable to determine severity"))


# --------------------------------------------------
# Force reload models (for debugging/testing)
# --------------------------------------------------
def reload_models():
    """Force reload models - useful for debugging constant output issues"""
    global _binary_model, _multi_model
    _binary_model = None
    _multi_model = None
    load_binary_model()
    load_multi_model()
    logger.info("Models reloaded successfully")


# --------------------------------------------------
# Main Prediction Function
# --------------------------------------------------
def predict_xray(image_path: str):
    try:
        logger.info(f"Starting prediction for: {image_path}")
        
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        # Load models - ensure fresh eval state
        binary_model = load_binary_model()
        multi_model = load_multi_model()

        # Preprocess image - creates fresh tensor each time
        image = preprocess_image(image_path)
        
        # Verify image tensor is properly formatted
        logger.info(f"Input tensor shape: {image.shape}, requires_grad: {image.requires_grad}")

        # Use inference mode or no_grad for inference
        with torch.inference_mode():
            # -------------------------
            # Stage 1: Binary Prediction
            # -------------------------
            binary_output = binary_model(image)
            logger.info(f"Binary output raw: {binary_output}")
            
            binary_probs = F.softmax(binary_output, dim=1)
            logger.info(f"Binary probabilities: {binary_probs}")
            
            pneumonia_probability = binary_probs[0][1].item()
            diagnosis = "Pneumonia" if pneumonia_probability > 0.5 else "Normal"

            logger.info(f"Diagnosis: {diagnosis}, Probability: {pneumonia_probability}")

            severity_label = "N/A"
            message = "No severity assessment needed - X-ray appears normal"

            # -------------------------
            # Stage 2: Severity Prediction
            # -------------------------
            if diagnosis == "Pneumonia":
                severity_output = multi_model(image)
                severity_probs = F.softmax(severity_output, dim=1)
                logger.info(f"Severity probabilities: {severity_probs}")
                
                severity_class = torch.argmax(severity_probs, dim=1).item()
                logger.info(f"Severity class: {severity_class}")

                severity_label, message = interpret_severity_class(severity_class)

        result = {
            "diagnosis": diagnosis,
            "pneumonia_probability": round(pneumonia_probability, 4),
            "severity_label": severity_label,
            "message": message,
            "model_version": "v2.0"
        }
        
        logger.info(f"Prediction result: {result}")
        return result

    except Exception as e:
        logger.error(f"Error in predict_xray: {e}", exc_info=True)
        raise
