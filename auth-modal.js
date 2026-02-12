/**
 * ClockWork Auth Modal Component
 * Reusable login/signup modal for subscribe and referral flows
 */

const AuthModal = {
    // Configuration
    API_BASE: window.location.hostname === 'localhost' ? 'http://localhost:5000' : '',

    // State
    isOpen: false,
    mode: 'login', // 'login' or 'signup'
    context: null, // 'subscribe' or 'referral'
    contextData: null, // Creator info for subscribe, or referral info
    onSuccess: null, // Callback after successful auth

    /**
     * Initialize the modal - inject HTML into the page
     */
    init() {
        if (document.getElementById('authModal')) return; // Already initialized

        const modalHTML = `
        <!-- Auth Modal Backdrop -->
        <div id="authModal" class="fixed inset-0 z-[9999] hidden">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="AuthModal.close()"></div>

            <!-- Modal Content -->
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="relative bg-[#12121a] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
                    <!-- Close Button -->
                    <button onclick="AuthModal.close()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10">
                        <i class="fas fa-times text-white"></i>
                    </button>

                    <!-- Context Header (Subscribe/Referral) -->
                    <div id="authModalHeader" class="p-6 pb-4">
                        <!-- Dynamic content based on context -->
                    </div>

                    <!-- Tab Switcher -->
                    <div class="flex border-b border-white/10 mx-6">
                        <button id="loginTab" onclick="AuthModal.switchMode('login')" class="flex-1 py-3 text-center font-semibold transition-colors border-b-2">
                            Log In
                        </button>
                        <button id="signupTab" onclick="AuthModal.switchMode('signup')" class="flex-1 py-3 text-center font-semibold transition-colors border-b-2">
                            Sign Up
                        </button>
                    </div>

                    <!-- Form Container -->
                    <div class="p-6">
                        <!-- Error Message -->
                        <div id="authError" class="hidden mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            <span id="authErrorText"></span>
                        </div>

                        <!-- Login Form -->
                        <form id="loginForm" class="space-y-4">
                            <div>
                                <label class="text-gray-400 text-sm block mb-2">Email</label>
                                <input type="email" id="loginEmail" required placeholder="you@example.com"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                            </div>
                            <div>
                                <label class="text-gray-400 text-sm block mb-2">Password</label>
                                <input type="password" id="loginPassword" required placeholder="Your password"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                            </div>
                            <button type="submit" id="loginBtn" class="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <span id="loginBtnText">Log In</span>
                                <span id="loginSpinner" class="hidden">
                                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            </button>
                        </form>

                        <!-- Signup Form -->
                        <form id="signupForm" class="space-y-4 hidden">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-gray-400 text-sm block mb-2">First Name</label>
                                    <input type="text" id="signupFirstName" required placeholder="John"
                                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                                </div>
                                <div>
                                    <label class="text-gray-400 text-sm block mb-2">Last Name</label>
                                    <input type="text" id="signupLastName" required placeholder="Doe"
                                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                                </div>
                            </div>
                            <div>
                                <label class="text-gray-400 text-sm block mb-2">Email</label>
                                <input type="email" id="signupEmail" required placeholder="you@example.com"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                            </div>
                            <div>
                                <label class="text-gray-400 text-sm block mb-2">Password</label>
                                <input type="password" id="signupPassword" required placeholder="Create a password (min 6 chars)" minlength="6"
                                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors">
                            </div>
                            <button type="submit" id="signupBtn" class="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <span id="signupBtnText">Create Account</span>
                                <span id="signupSpinner" class="hidden">
                                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            </button>
                        </form>

                        <!-- Terms -->
                        <p class="text-gray-500 text-xs text-center mt-4">
                            By continuing, you agree to our <a href="/terms" class="text-orange-400 hover:underline">Terms</a> and <a href="/privacy" class="text-orange-400 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Attach form handlers
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            AuthModal.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            AuthModal.handleSignup();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AuthModal.isOpen) {
                AuthModal.close();
            }
        });
    },

    /**
     * Open the modal for subscribe flow
     * @param {Object} creator - Creator info { id, handle, name, profilePicture, price }
     * @param {Function} onSuccess - Callback with auth token and user data
     */
    openForSubscribe(creator, onSuccess) {
        this.init();
        this.context = 'subscribe';
        this.contextData = creator;
        this.onSuccess = onSuccess;

        const priceFormatted = `$${(creator.price / 100).toFixed(2)}`;

        document.getElementById('authModalHeader').innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <img src="${creator.profilePicture || 'https://ui-avatars.com/api/?background=ff6b35&color=fff&size=80&name=' + encodeURIComponent(creator.name || creator.handle)}"
                    alt="${creator.name}" class="w-16 h-16 rounded-full object-cover border-2 border-orange-500">
                <div>
                    <h3 class="font-bold text-lg text-white">${creator.name || '@' + creator.handle}</h3>
                    <p class="text-gray-400 text-sm">@${creator.handle}</p>
                </div>
            </div>
            <div class="bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-xl p-4 border border-orange-500/30">
                <p class="text-white font-semibold mb-2">Subscribe for ${priceFormatted}/month</p>
                <ul class="space-y-1 text-sm text-gray-300">
                    <li><i class="fas fa-check text-green-400 mr-2"></i>Full access to exclusive content</li>
                    <li><i class="fas fa-check text-green-400 mr-2"></i>Direct message with creator</li>
                    <li><i class="fas fa-check text-green-400 mr-2"></i>Cancel anytime</li>
                </ul>
            </div>
        `;

        this.show();
    },

    /**
     * Open the modal for referral code flow
     * @param {Object} userData - Pre-filled user data { firstName, lastName, email }
     * @param {Function} onSuccess - Callback with auth token and user data
     */
    openForReferral(userData, onSuccess) {
        this.init();
        this.context = 'referral';
        this.contextData = userData;
        this.onSuccess = onSuccess;

        document.getElementById('authModalHeader').innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <i class="fas fa-dollar-sign text-white text-2xl"></i>
                </div>
                <h3 class="font-bold text-xl text-white mb-2">Create Your Account</h3>
                <p class="text-gray-400 text-sm">Sign up to get your unique referral code and start earning</p>
            </div>
            <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 mt-4">
                <ul class="space-y-1 text-sm text-gray-300">
                    <li><i class="fas fa-check text-green-400 mr-2"></i>Earn $3-5 per signup</li>
                    <li><i class="fas fa-check text-green-400 mr-2"></i>10% recurring commission</li>
                    <li><i class="fas fa-check text-green-400 mr-2"></i>Track earnings in your dashboard</li>
                </ul>
            </div>
        `;

        // Pre-fill signup form if data provided
        if (userData) {
            if (userData.firstName) document.getElementById('signupFirstName').value = userData.firstName;
            if (userData.lastName) document.getElementById('signupLastName').value = userData.lastName;
            if (userData.email) document.getElementById('signupEmail').value = userData.email;
        }

        // Default to signup mode for referral flow
        this.switchMode('signup');
        this.show();
    },

    /**
     * Show the modal
     */
    show() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        this.hideError();
        this.updateTabs();
    },

    /**
     * Close the modal
     */
    close() {
        const modal = document.getElementById('authModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.isOpen = false;
        this.resetForms();
    },

    /**
     * Switch between login and signup modes
     */
    switchMode(mode) {
        this.mode = mode;
        this.updateTabs();
        this.hideError();

        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (mode === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    },

    /**
     * Update tab styling
     */
    updateTabs() {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');

        if (this.mode === 'login') {
            loginTab.classList.add('text-white', 'border-orange-500');
            loginTab.classList.remove('text-gray-500', 'border-transparent');
            signupTab.classList.add('text-gray-500', 'border-transparent');
            signupTab.classList.remove('text-white', 'border-orange-500');
        } else {
            signupTab.classList.add('text-white', 'border-orange-500');
            signupTab.classList.remove('text-gray-500', 'border-transparent');
            loginTab.classList.add('text-gray-500', 'border-transparent');
            loginTab.classList.remove('text-white', 'border-orange-500');
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        const errorEl = document.getElementById('authError');
        const errorText = document.getElementById('authErrorText');
        errorText.textContent = message;
        errorEl.classList.remove('hidden');
    },

    /**
     * Hide error message
     */
    hideError() {
        document.getElementById('authError').classList.add('hidden');
    },

    /**
     * Reset all forms
     */
    resetForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
        this.hideError();
    },

    /**
     * Set loading state
     */
    setLoading(isLoading) {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const loginBtnText = document.getElementById('loginBtnText');
        const signupBtnText = document.getElementById('signupBtnText');
        const loginSpinner = document.getElementById('loginSpinner');
        const signupSpinner = document.getElementById('signupSpinner');

        if (isLoading) {
            loginBtn.disabled = true;
            signupBtn.disabled = true;
            loginBtnText.classList.add('hidden');
            signupBtnText.classList.add('hidden');
            loginSpinner.classList.remove('hidden');
            signupSpinner.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            signupBtn.disabled = false;
            loginBtnText.classList.remove('hidden');
            signupBtnText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
            signupSpinner.classList.add('hidden');
        }
    },

    /**
     * Handle login form submission
     */
    async handleLogin() {
        this.hideError();
        this.setLoading(true);

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${this.API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user info (token is in HTTP-only cookie)
            localStorage.setItem('user', JSON.stringify(data.user));

            // Call success callback
            if (this.onSuccess) {
                this.onSuccess(null, data.user);
            }

            this.close();

        } catch (error) {
            this.showError(error.message || 'Login failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    },

    /**
     * Handle signup form submission
     */
    async handleSignup() {
        this.hideError();
        this.setLoading(true);

        const firstName = document.getElementById('signupFirstName').value.trim();
        const lastName = document.getElementById('signupLastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;

        try {
            const response = await fetch(`${this.API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    password,
                    userType: 'individual' // Register as member tier
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Signup failed');
            }

            // Store user info (token is in HTTP-only cookie)
            localStorage.setItem('user', JSON.stringify(data.user));

            // Call success callback
            if (this.onSuccess) {
                this.onSuccess(null, data.user);
            }

            this.close();

        } catch (error) {
            this.showError(error.message || 'Signup failed. Please try again.');
        } finally {
            this.setLoading(false);
        }
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!localStorage.getItem('user');
    },

    /**
     * Get current auth token (token is in HTTP-only cookie, so this returns null)
     */
    getToken() {
        return null; // Token is stored in HTTP-only cookie
    },

    /**
     * Get current user
     */
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Logout user
     */
    async logout() {
        // Call backend to clear cookie
        try {
            await fetch(`${this.API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {}

        localStorage.removeItem('user');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthModal.init());
} else {
    AuthModal.init();
}
