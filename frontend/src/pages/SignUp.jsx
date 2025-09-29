import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import civixLogo from '../assets/civix-logo.png';
import communityImg from '../assets/community.png';
import mailIcon from '../assets/mail.svg';
import userIcon from '../assets/user.svg';
import eyeOpenIcon from '../assets/eye-open.svg';
import eyeClosedIcon from '../assets/eye-closed.svg';
import googleIcon from '../assets/google.svg';
import facebookIcon from '../assets/facebook.svg';
import twitterIcon from '../assets/twitter.svg';
import locationIcon from '../assets/location.svg';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((v) => !v);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((v) => !v);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupClick = async () => {
    setMessage('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage('Please fill all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/civix/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Account created successfully!');
        setFormData({ name: '', email: '', password: '', confirmPassword: '', location: '' });
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto overflow-hidden w-[1440px] h-[1024px] bg-[#D7E9ED] rounded-[30px]">
      {/* Ellipse 1 (left background) */}
      <div className="absolute rounded-full" style={{ width: '1463px', height: '1294px', left: '555px', top: '-307px', backgroundColor: '#CBDEEC' }}></div>

      {/* Right side gradient bars */}
      <div className="absolute" style={{ width: '97px', height: '514px', left: '1343px', top: '0px', background: 'linear-gradient(182.37deg, #64B3AD 5.78%, #407470 38.95%, #2B4D4A 94.22%)' }}></div>
      <div className="absolute" style={{ width: '97px', height: '514px', left: '1343px', top: '514px', background: 'linear-gradient(178.33deg, #33556E 0.26%, #64B3AD 84.92%)' }}></div>

      {/* Main panel - match Login page design */}
      <div
        className="absolute left-[136px] top-[148px] w-[1088px] h-[702px] bg-[#D9D9D9] opacity-60 border border-[#407470] rounded-[40px]"
        style={{ boxShadow: '0px 4px 50px 15px rgba(0,0,0,0.25)' }}
      ></div>

      {/* Bottom-left ellipses */}
      <div className="absolute rounded-full" style={{ width: '316px', height: '279px', left: '-92px', top: '835px', backgroundColor: '#CBDEEC' }}></div>
      <div className="absolute rounded-full" style={{ width: '163px', height: '156px', left: '98px', top: '705px', background: 'linear-gradient(180deg, #2B4D4A 0%, #64B3AC 100%)', boxShadow: '0px 4px 80px rgba(0, 0, 0, 0.25)' }}></div>

      {/* Civix logo */}
      <div className="absolute" style={{ width: '450px', height: '450px', left: '-127px', top: '-169px', background: `url(${civixLogo}) center/contain no-repeat` }}></div>

      {/* Community illustration */}
      <div className="absolute z-10" style={{ width: '582px', height: '383px', left: '142px', top: '322px', background: `url(${communityImg}) center/contain no-repeat` }}></div>

      {/* Divider line */}
      <div className="absolute border-black rotate-180" style={{ width: '452px', height: '0px', left: '684px', top: '673px' }}></div>

      {/* Titles */}
      <div className="absolute" style={{ width: '246px', height: '58px', left: '790px', top: '189px' }}>
        <div className="absolute flex items-center text-center text-black" style={{ width: '100px', height: '33px', left: '76px', top: '0px', fontFamily: 'Jacques Francois, serif', fontSize: '25px', lineHeight: '33px' }}>Sign-Up</div>
        <div className="absolute flex items-center text-center text-black" style={{ width: '246px', height: '18px', left: '0px', top: '40px', fontFamily: 'Perpetua, serif', fontSize: '16px', lineHeight: '18px' }}>
          Create Your Civix Account to Join With Us
        </div>
      </div>

      {/* Already have account */}
      <div className="absolute" style={{ width: '241.65px', height: '34px', left: '790px', top: '786px' }}>
        <div className="absolute flex items-center text-center text-black" style={{ width: '198px', height: '32px', left: '0px', top: '1px', fontFamily: 'Perpetua, serif', fontSize: '19px', lineHeight: '22px' }}>
          Already have an account
        </div>
        <div className="absolute border border-black rotate-180" style={{ width: '53.65px', height: '0px', left: '188px', top: '26px' }}></div>
        <Link to="/login" className="absolute flex items-center text-center text-black cursor-pointer" style={{ width: '50.42px', height: '34px', left: '186px', top: '0px', fontFamily: 'Protest Strike, sans-serif', fontSize: '16px', lineHeight: '19px' }}>
          Log-in
        </Link>
      </div>

      {/* Right content grouping */}
      <div className="absolute" style={{ width: '459px', height: '379px', left: '677px', top: '268px' }}>
        {/* Sign-Up Button */}
        {/* Message Display */}
        {message && (
          <div 
            className="absolute flex items-center justify-center text-center"
            style={{ 
              width: '459px', 
              height: '20px', 
              left: '0px', 
              top: '300px',
              fontFamily: 'Perpetua, serif',
              fontSize: '14px',
              color: message.includes('successfully') ? '#2B4D4A' : '#d32f2f'
            }}
          >
            {message}
          </div>
        )}

        <button
          type="button"
          className="absolute cursor-pointer bg-transparent border-none p-0 shadow-none rounded-none outline-none focus:outline-none focus-visible:outline-none hover:outline-none hover:border-transparent"
          style={{ width: '167px', height: '52px', left: '156px', top: '327px', border: 'none', outline: 'none' }}
          onClick={!loading ? handleSignupClick : undefined}
          disabled={loading}
        >
          <div
            className="absolute rounded-[30px] shadow-none"
            style={{ width: '167px', height: '52px', left: '0px', top: '0px', backgroundColor: '#2B4D4A' }}
          ></div>
          <div
            className="absolute flex items-center justify-center"
            style={{ width: '167px', height: '52px', left: '0px', top: '0px', fontFamily: 'Jacques Francois, serif', fontSize: '20px', lineHeight: '26px', color: '#D7E9ED' }}
          >
            {loading ? 'Signing Up...' : 'Sign-Up'}
          </div>
        </button>

        {/* Email */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '78px' }}>
          <div className="absolute rounded-[30px]" style={{ width: '459px', height: '63px', left: '0px', top: '0px', backgroundColor: 'rgba(43,108,99,0.1)' }}></div>
          <img className="absolute object-contain pointer-events-none" style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 5 }} src={mailIcon} alt="Email icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black caret-black"
            style={{ left: '20px', top: '16px', width: '370px', height: '30px', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', color: '#000000' }}
            placeholder="Email ID"
            aria-label="Email"
          />
        </div>

        {/* Username */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '0px' }}>
          <div className="absolute rounded-[30px]" style={{ width: '459px', height: '63px', left: '0px', top: '0px', backgroundColor: 'rgba(43,108,99,0.1)' }}></div>
          <img className="absolute object-contain pointer-events-none" style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 5 }} src={userIcon} alt="User icon" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black caret-black"
            style={{ left: '20px', top: '16px', width: '370px', height: '30px', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', color: '#000000' }}
            placeholder="Name"
            aria-label="Name"
          />
        </div>

        {/* Password left */}
        <div className="absolute" style={{ width: '226px', height: '63px', left: '3px', top: '162px', zIndex: 60 }}>
          <div className="absolute rounded-[30px]" style={{ width: '226px', height: '63px', left: '0px', top: '0px', backgroundColor: 'rgba(43,108,99,0.1)' }}></div>
          <img className="absolute object-contain cursor-pointer" style={{ left: '186px', top: '20px', width: '24px', height: '24px', zIndex: 5 }} src={isPasswordVisible ? eyeOpenIcon : eyeClosedIcon} alt="Toggle password visibility" onClick={togglePasswordVisibility} />
          <input
            ref={passwordInputRef}
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black caret-black"
            style={{ left: '16px', top: '16px', width: '160px', height: '30px', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', color: '#000000' }}
            placeholder="Password"
            aria-label="Password"
          />
        </div>

        {/* Password right */}
        <div className="absolute" style={{ width: '222px', height: '63px', left: '237px', top: '162px', zIndex: 60 }}>
          <div className="absolute rounded-[30px]" style={{ width: '222px', height: '63px', left: '0px', top: '0px', backgroundColor: 'rgba(43,108,99,0.1)' }}></div>
          <img className="absolute object-contain cursor-pointer" style={{ left: '180px', top: '20px', width: '24px', height: '24px', zIndex: 5 }} src={isConfirmPasswordVisible ? eyeOpenIcon : eyeClosedIcon} alt="Toggle confirm password visibility" onClick={toggleConfirmPasswordVisibility} />
          <input
            ref={confirmPasswordInputRef}
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black caret-black"
            style={{ left: '14px', top: '16px', width: '150px', height: '30px', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', color: '#000000' }}
            placeholder="Confirm Password"
            aria-label="Confirm Password"
          />
        </div>

        {/* Location */}
        <div className="absolute" style={{ width: '459px', height: '63px', left: '0px', top: '242px', zIndex: 60 }}>
          <div className="absolute rounded-[30px]" style={{ width: '459px', height: '63px', left: '0px', top: '0px', backgroundColor: 'rgba(43,108,99,0.1)' }}></div>
          <img className="absolute object-contain cursor-pointer" style={{ left: '415px', top: '20px', width: '24px', height: '24px', zIndex: 50 }} src={locationIcon} alt="Location picker" onClick={() => alert('Open location picker')} />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="absolute border-none outline-none bg-transparent text-base text-black placeholder-black caret-black"
            style={{ left: '20px', top: '16px', width: '380px', height: '30px', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', color: '#000000' }}
            placeholder="Location"
            aria-label="Location"
          />
        </div>

        <div className="absolute flex items-center text-black" style={{ width: '180px', height: '13px', left: '150px', top: '430px', fontFamily: 'Copperplate Gothic Light, serif', fontSize: '12px', lineHeight: '13px' }}>
          Alternative Sign-up Method
        </div>
      </div>

      {/* Social icons */}
      <button className="absolute rounded-full bg-transparent flex items-center justify-center cursor-pointer border-none p-0" style={{ width: '41px', height: '41px', left: '724px', top: '727px', zIndex: 40 }} onClick={() => alert('Continue with Google')} aria-label="Sign in with Google">
        <img src={googleIcon} alt="Google" className="w-[24px] h-[24px] object-contain" />
      </button>
      <button className="absolute rounded-full bg-transparent flex items-center justify-center cursor-pointer border-none p-0" style={{ width: '41px', height: '41px', left: '886px', top: '728px', zIndex: 40 }} onClick={() => alert('Continue with Facebook')} aria-label="Sign in with Facebook">
        <img src={facebookIcon} alt="Facebook" className="w-[24px] h-[24px] object-contain" />
      </button>
      <button className="absolute rounded-full bg-transparent flex items-center justify-center cursor-pointer border-none p-0" style={{ width: '41px', height: '41px', left: '1063px', top: '727px', zIndex: 40 }} onClick={() => alert('Continue with Twitter')} aria-label="Sign in with Twitter">
        <img src={twitterIcon} alt="Twitter" className="w-[24px] h-[24px] object-contain" />
      </button>
    </div>
  );
}
