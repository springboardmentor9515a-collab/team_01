import React, { useState, useEffect, useRef } from 'react';

const SignUp = () => {
  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isEyeOpenAvailable, setIsEyeOpenAvailable] = useState(false);
  const [locationIconSrc, setLocationIconSrc] = useState('/assets/location.png');
  
  // Refs for form inputs
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  
  // Constants for icons - using image files from assets folder
  const EYE_OPEN_SRC = '/assets/Eye-closed.png';
  const EYE_CLOSED_SRC = '/assets/Eye-closed.png';
  const EMAIL_ICON_SRC = '/assets/mail.jpg';
  const USER_ICON_SRC = '/assets/user.jpg';
  const GOOGLE_ICON_SRC = '/assets/google.png';
  const FACEBOOK_ICON_SRC = '/assets/facebook.png';
  const TWITTER_ICON_SRC = '/assets/twitter.png';

  // Check if eye open icon is available
  useEffect(() => {
    const probeOpen = new Image();
    probeOpen.onload = () => setIsEyeOpenAvailable(true);
    probeOpen.onerror = () => setIsEyeOpenAvailable(false);
    probeOpen.src = EYE_OPEN_SRC;
  }, []);

  // Simple fallback for location icon
  useEffect(() => {
    const img = new Image();
    img.onerror = () => {
      // If the image fails to load, keep the default path
      console.log('Location icon not found, using default');
    };
    img.onload = () => {
      console.log('Location icon loaded successfully');
    };
    img.src = locationIconSrc;
  }, [locationIconSrc]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (passwordInputRef.current) {
      passwordInputRef.current.type = isPasswordVisible ? 'password' : 'text';
    }
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    if (confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.type = isConfirmPasswordVisible ? 'password' : 'text';
    }
  };

  // Handle location click
  const handleLocationClick = () => {
    alert('Open location picker');
  };

  // Handle signup button click
  const handleSignupClick = () => {
    console.log('Sign-Up clicked');
    alert('Sign-Up clicked');
  };

  // Handle login link click
  const handleLoginClick = () => {
    console.log('Navigate to Log-in');
    alert('Navigate to Log-in');
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    alert('Continue with ' + provider);
  };

  // Handle keyboard events
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="relative mx-auto overflow-hidden" style={{ width: '1440px', height: '1024px', backgroundColor: '#D7E9ED', borderRadius: '30px' }}>
      {/* Ellipse 1 (left background) */}
      <div 
        className="absolute rounded-full" 
        style={{ 
          width: '1463px', 
          height: '1294px', 
          left: '555px', 
          top: '-307px', 
          backgroundColor: '#CBDEEC' 
        }}
      ></div>
      
      {/* Right side gradient bars */}
      <div 
        className="absolute" 
        style={{ 
          width: '97px', 
          height: '514px', 
          left: '1343px', 
          top: '0px',
          background: 'linear-gradient(182.37deg, #64B3AD 5.78%, #407470 38.95%, #2B4D4A 94.22%)'
        }}
      ></div>
      <div 
        className="absolute" 
        style={{ 
          width: '97px', 
          height: '514px', 
          left: '1343px', 
          top: '514px',
          background: 'linear-gradient(178.33deg, #33556E 0.26%, #64B3AD 84.92%)'
        }}
      ></div>

      {/* Community illustration */}
      <div 
        className="absolute z-10"
        style={{
          width: '582px',
          height: '383px',
          left: '142px',
          top: '322px',
          background: "url('/assets/community.png') center/contain no-repeat"
        }}
      ></div>
      <div 
        className="absolute"
        style={{
          width: '582px',
          height: '383px',
          left: '98px',
          top: '322px',
          background: "url('/assets/text-on-path.png') center/contain no-repeat"
        }}
      ></div>

      {/* Main translucent card */}
      <div 
        className="absolute border rounded-40"
        style={{ 
          width: '1088px', 
          height: '702px', 
          left: '136px', 
          top: '148px', 
          backgroundColor: '#D9D9D9', 
          opacity: 0.6, 
          borderColor: '#407470',
          boxShadow: '0px 4px 50px 15px rgba(0, 0, 0, 0.25)'
        }}
      ></div>

      {/* Bottom-left ellipses */}
      <div 
        className="absolute rounded-full" 
        style={{ 
          width: '316px', 
          height: '279px', 
          left: '-92px', 
          top: '835px', 
          backgroundColor: '#CBDEEC' 
        }}
      ></div>
      <div 
        className="absolute rounded-full" 
        style={{ 
          width: '163px', 
          height: '156px', 
          left: '98px', 
          top: '705px',
          background: 'linear-gradient(180deg, #2B4D4A 0%, #64B3AC 100%)',
          boxShadow: '0px 4px 80px rgba(0, 0, 0, 0.25)'
        }}
      ></div>

      {/* Civix logo */}
      <div 
        className="absolute"
        style={{
          width: '450px',
          height: '450px',
          left: '-127px',
          top: '-169px',
          background: "url('/assets/civix-logo.png') center/contain no-repeat"
        }}
      ></div>

      {/* Right big blurry ellipse duplicates */}
      <div 
        className="absolute rounded-full backdrop-blur-40" 
        style={{ 
          width: '1463px', 
          height: '1294px', 
          left: '2169.3px', 
          top: '-283px', 
          backgroundColor: 'rgba(203, 222, 236, 0.1)',
          boxShadow: 'inset 91.9px -91.9px 91.9px rgba(154, 169, 179, 0.1), inset -91.9px 91.9px 91.9px rgba(255, 255, 255, 0.1)'
        }}
      ></div>
      <div 
        className="absolute rounded-full backdrop-blur-92" 
        style={{ 
          width: '1463px', 
          height: '1294px', 
          left: '2169.3px', 
          top: '-283px', 
          backgroundColor: 'rgba(203, 222, 236, 0.1)',
          boxShadow: 'inset 91.9px -91.9px 91.9px rgba(154, 169, 179, 0.1), inset -91.9px 91.9px 91.9px rgba(255, 255, 255, 0.1)'
        }}
      ></div>

      {/* Divider line */}
      <div 
        className="absolute border-black transform rotate-180" 
        style={{ 
          width: '452px', 
          height: '0px', 
          left: '684px', 
          top: '673px' 
        }}
      ></div>

      {/* Titles */}
      <div className="absolute" style={{ width: '246px', height: '58px', left: '790px', top: '189px' }}>
        <div 
          className="absolute flex items-center text-center text-black"
          style={{ 
            width: '100px', 
            height: '33px', 
            left: '76px', 
            top: '0px',
            fontFamily: 'Jacques Francois, serif',
            fontSize: '25px',
            lineHeight: '33px'
          }}
        >
          Sign-Up
        </div>
        <div 
          className="absolute flex items-center text-center text-black"
          style={{ 
            width: '246px', 
            height: '18px', 
            left: '0px', 
            top: '40px',
            fontFamily: 'Perpetua, serif',
            fontSize: '16px',
            lineHeight: '18px'
          }}
        >
          Create Your Civix Account to Join With Us
        </div>
      </div>

      {/* Already have account */}
      <div className="absolute" style={{ width: '241.65px', height: '34px', left: '790px', top: '786px' }}>
        <div 
          className="absolute flex items-center text-center text-black"
          style={{ 
            width: '198px', 
            height: '32px', 
            left: '0px', 
            top: '1px',
            fontFamily: 'Perpetua, serif',
            fontSize: '19px',
            lineHeight: '22px'
          }}
        >
          Already have an account ;
        </div>
        <div 
          className="absolute border border-black transform rotate-180" 
          style={{ 
            width: '53.65px', 
            height: '0px', 
            left: '188px', 
            top: '26px' 
          }}
        ></div>
        <div 
          className="absolute flex items-center text-center text-black cursor-pointer"
          style={{ 
            width: '50.42px', 
            height: '34px', 
            left: '186px', 
            top: '0px',
            fontFamily: 'Protest Strike, sans-serif',
            fontSize: '16px',
            lineHeight: '19px'
          }}
          onClick={handleLoginClick}
          onKeyDown={(e) => handleKeyDown(e, handleLoginClick)}
          role="button"
          tabIndex={0}
        >
          Log-in
        </div>
      </div>

      {/* Right content grouping */}
      <div className="absolute" style={{ width: '459px', height: '379px', left: '677px', top: '268px' }}>
        {/* Button */}
        <div 
          className="absolute cursor-pointer"
          style={{ width: '167px', height: '52px', left: '156px', top: '327px' }}
          onClick={handleSignupClick}
          onKeyDown={(e) => handleKeyDown(e, handleSignupClick)}
          role="button"
          tabIndex={0}
        >
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '167px', 
              height: '52px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: '#2B4D4A' 
            }}
          ></div>
          <div 
            className="absolute flex items-center justify-center text-civix-light"
            style={{ 
              width: '167px', 
              height: '52px', 
              left: '0px', 
              top: '0px',
              fontFamily: 'Jacques Francois, serif',
              fontSize: '20px',
              lineHeight: '26px',
              color: '#D7E9ED'
            }}
          >
            Sign-Up
          </div>
        </div>

        {/* Email */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '78px' }}>
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '459px', 
              height: '63px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: 'rgba(43,108,99,0.1)' 
            }}
          ></div>
          <div className="absolute pointer-events-none" style={{ width: '40px', height: '40px', left: '415px', top: '20px', zIndex: 2 }}></div>
          <img 
            className="absolute object-contain pointer-events-none" 
            style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 5 }}
            src="/assets/mail.svg"
            alt="Email icon" 
          />
          <input 
            type="email" 
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black placeholder-opacity-60" 
            style={{ 
              left: '20px', 
              top: '16px', 
              width: '370px', 
              height: '30px',
              fontFamily: 'Perpetua, serif'
            }}
            placeholder="Email ID" 
            aria-label="Email" 
          />
        </div>

        {/* Username */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '0px' }}>
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '459px', 
              height: '63px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: 'rgba(43,108,99,0.1)' 
            }}
          ></div>
          <div className="absolute pointer-events-none" style={{ width: '44px', height: '36px', left: '415px', top: '20px', zIndex: 2 }}></div>
          <img 
            className="absolute object-contain pointer-events-none" 
            style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 5 }}
            src="/assets/user.svg"
            alt="User icon" 
          />
          <input 
            type="text" 
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black placeholder-opacity-60" 
            style={{ 
              left: '20px', 
              top: '16px', 
              width: '370px', 
              height: '30px',
              fontFamily: 'Perpetua, serif'
            }}
            placeholder="Name" 
            aria-label="Name" 
          />
        </div>

        {/* Password left */}
        <div className="absolute" style={{ width: '226px', height: '63px', left: '3px', top: '162px', zIndex: 60 }}>
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '226px', 
              height: '63px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: 'rgba(43,108,99,0.1)' 
            }}
          ></div>
          <div 
            className="absolute"
            style={{ width: '24.43px', height: '24px', left: '186px', top: '20px' }}
            onClick={togglePasswordVisibility}
            onKeyDown={(e) => handleKeyDown(e, togglePasswordVisibility)}
            role="button"
            tabIndex={0}
          >
            <div className="hidden"></div>
          </div>
          <img 
            className="absolute object-contain pointer-events-auto cursor-pointer" 
            style={{ left: '186px', top: '20px', width: '24.43px', height: '24px', zIndex: 5 }}
            src={isPasswordVisible ? "/assets/eye-open.svg" : "/assets/eye-closed.svg"}
            alt="Toggle password visibility"
            onClick={togglePasswordVisibility}
            onKeyDown={(e) => handleKeyDown(e, togglePasswordVisibility)}
            role="button"
            tabIndex={0}
          />
          <input 
            ref={passwordInputRef}
            type="password" 
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black placeholder-opacity-60" 
            style={{ 
              left: '16px', 
              top: '16px', 
              width: '160px', 
              height: '30px',
              fontFamily: 'Perpetua, serif'
            }}
            placeholder="Password" 
            aria-label="Password" 
          />
        </div>

        {/* Password right */}
        <div className="absolute" style={{ width: '222px', height: '63px', left: '237px', top: '162px', zIndex: 60 }}>
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '222px', 
              height: '63px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: 'rgba(43,108,99,0.1)' 
            }}
          ></div>
          <div 
            className="absolute"
            style={{ width: '24px', height: '24px', left: '180px', top: '20px' }}
            onClick={toggleConfirmPasswordVisibility}
            onKeyDown={(e) => handleKeyDown(e, toggleConfirmPasswordVisibility)}
            role="button"
            tabIndex={0}
          >
            <div className="hidden"></div>
          </div>
          <img 
            className="absolute object-contain pointer-events-auto cursor-pointer" 
            style={{ left: '180px', top: '20px', width: '24px', height: '24px', zIndex: 5 }}
            src={isConfirmPasswordVisible ? "/assets/eye-open.svg" : "/assets/eye-closed.svg"}
            alt="Toggle confirm password visibility"
            onClick={toggleConfirmPasswordVisibility}
            onKeyDown={(e) => handleKeyDown(e, toggleConfirmPasswordVisibility)}
            role="button"
            tabIndex={0}
          />
          <input 
            ref={confirmPasswordInputRef}
            type="password" 
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black placeholder-opacity-60" 
            style={{ 
              left: '14px', 
              top: '16px', 
              width: '150px', 
              height: '30px',
              fontFamily: 'Perpetua, serif'
            }}
            placeholder="Confirm Password" 
            aria-label="Confirm Password" 
          />
        </div>

        {/* Location */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '242px', zIndex: 60 }}>
          <div 
            className="absolute rounded-30"
            style={{ 
              width: '459px', 
              height: '63px', 
              left: '0px', 
              top: '0px', 
              backgroundColor: 'rgba(43,108,99,0.1)' 
            }}
          ></div>
          <div className="absolute" style={{ width: '24px', height: '24px', left: '415px', top: '20px' }}>
            <div className="hidden"></div>
          </div>
          <img 
            className="absolute object-contain pointer-events-auto cursor-pointer outline-none border-none focus:outline-none focus:shadow-none focus-visible:outline-none focus-visible:shadow-none" 
            style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 50 }}
            src="/assets/location.svg"
            alt="Location picker"
            onClick={handleLocationClick}
            onKeyDown={(e) => handleKeyDown(e, handleLocationClick)}
            role="button"
            tabIndex={0}
          />
          <input 
            type="text" 
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black placeholder-opacity-60" 
            style={{ 
              left: '20px', 
              top: '16px', 
              width: '380px', 
              height: '30px',
              fontFamily: 'Perpetua, serif'
            }}
            placeholder="Location" 
            aria-label="Location" 
          />
        </div>

        <div 
          className="absolute flex items-center text-black"
          style={{ 
            width: '180px', 
            height: '13px', 
            left: '150px', 
            top: '430px',
            fontFamily: 'Copperplate Gothic Light, serif',
            fontSize: '12px',
            lineHeight: '13px'
          }}
        >
          Alternative Sign-up Method
        </div>
      </div>

      {/* Social icons */}
      <div className="absolute" style={{ width: '390px', height: '43px', left: '724px', top: '727px', zIndex: 30 }}></div>
      <button 
        className="absolute rounded-6 cursor-pointer border-none p-0 bg-transparent"
        style={{
          width: '43px',
          height: '43px',
          left: '724px',
          top: '727px',
          zIndex: 40,
          background: `url('/assets/google.svg') center/contain no-repeat`
        }}
        onClick={() => handleSocialLogin('Google')}
        onKeyDown={(e) => handleKeyDown(e, () => handleSocialLogin('Google'))}
        aria-label="Sign in with Google"
      ></button>
      <button 
        className="absolute rounded-6 cursor-pointer border-none p-0 bg-transparent"
        style={{
          width: '67px',
          height: '42px',
          left: '886px',
          top: '728px',
          zIndex: 40,
          background: `url('/assets/facebook.svg') center/contain no-repeat`
        }}
        onClick={() => handleSocialLogin('Facebook')}
        onKeyDown={(e) => handleKeyDown(e, () => handleSocialLogin('Facebook'))}
        aria-label="Sign in with Facebook"
      ></button>
      <button 
        className="absolute rounded-6 cursor-pointer border-none p-0 bg-transparent pointer-events-auto"
        style={{
          width: '51px',
          height: '42px',
          left: '1063px',
          top: '727px',
          zIndex: 9999,
          background: `url('/assets/twitter.svg') center/contain no-repeat`
        }}
        onClick={() => handleSocialLogin('Twitter')}
        onKeyDown={(e) => handleKeyDown(e, () => handleSocialLogin('Twitter'))}
        aria-label="Sign in with Twitter"
      ></button>
    </div>
  );
};

export default SignUp;
