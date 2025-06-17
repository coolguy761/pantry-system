// Password requirements
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
};

// Password strength levels
const PASSWORD_STRENGTH = {
    WEAK: { score: 0, label: 'Weak', color: '#dc3545' },
    MEDIUM: { score: 1, label: 'Medium', color: '#ffc107' },
    STRONG: { score: 2, label: 'Strong', color: '#28a745' },
    VERY_STRONG: { score: 3, label: 'Very Strong', color: '#198754' }
};

// Check password strength
function checkPasswordStrength(password) {
    let score = 0;
    const feedback = [];

    // Check length
    if (password.length >= PASSWORD_REQUIREMENTS.minLength) {
        score++;
    } else {
        feedback.push(`At least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }

    // Check for uppercase
    if (PASSWORD_REQUIREMENTS.requireUppercase && /[A-Z]/.test(password)) {
        score++;
    } else if (PASSWORD_REQUIREMENTS.requireUppercase) {
        feedback.push('At least one uppercase letter');
    }

    // Check for lowercase
    if (PASSWORD_REQUIREMENTS.requireLowercase && /[a-z]/.test(password)) {
        score++;
    } else if (PASSWORD_REQUIREMENTS.requireLowercase) {
        feedback.push('At least one lowercase letter');
    }

    // Check for numbers
    if (PASSWORD_REQUIREMENTS.requireNumbers && /\d/.test(password)) {
        score++;
    } else if (PASSWORD_REQUIREMENTS.requireNumbers) {
        feedback.push('At least one number');
    }

    // Check for special characters
    if (PASSWORD_REQUIREMENTS.requireSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score++;
    } else if (PASSWORD_REQUIREMENTS.requireSpecialChars) {
        feedback.push('At least one special character');
    }

    // Determine strength level
    let strength;
    if (score <= 2) {
        strength = PASSWORD_STRENGTH.WEAK;
    } else if (score === 3) {
        strength = PASSWORD_STRENGTH.MEDIUM;
    } else if (score === 4) {
        strength = PASSWORD_STRENGTH.STRONG;
    } else {
        strength = PASSWORD_STRENGTH.VERY_STRONG;
    }

    return {
        strength,
        feedback,
        isValid: score >= 3 // Password is valid if it meets at least 3 requirements
    };
}

// Create password strength indicator HTML
function createPasswordStrengthIndicator() {
    const container = document.createElement('div');
    container.className = 'password-strength-container';
    container.innerHTML = `
        <div class="password-strength-meter">
            <div class="strength-bar"></div>
        </div>
        <div class="strength-label"></div>
        <div class="password-requirements"></div>
    `;
    return container;
}

// Update password strength indicator
function updatePasswordStrengthIndicator(password, container) {
    const { strength, feedback } = checkPasswordStrength(password);
    const strengthBar = container.querySelector('.strength-bar');
    const strengthLabel = container.querySelector('.strength-label');
    const requirementsList = container.querySelector('.password-requirements');

    // Update strength bar
    strengthBar.style.width = `${(strength.score + 1) * 25}%`;
    strengthBar.style.backgroundColor = strength.color;

    // Update strength label
    strengthLabel.textContent = strength.label;
    strengthLabel.style.color = strength.color;

    // Update requirements list
    requirementsList.innerHTML = feedback.map(req => `<li>${req}</li>`).join('');
}

// Validate password
function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return {
            isValid: false,
            message: 'Passwords do not match'
        };
    }

    const { isValid, feedback } = checkPasswordStrength(password);
    if (!isValid) {
        return {
            isValid: false,
            message: 'Password does not meet requirements: ' + feedback.join(', ')
        };
    }

    return {
        isValid: true,
        message: 'Password is valid'
    };
}

export {
    PASSWORD_REQUIREMENTS,
    PASSWORD_STRENGTH,
    checkPasswordStrength,
    createPasswordStrengthIndicator,
    updatePasswordStrengthIndicator,
    validatePassword
}; 