import { useState, useRef } from 'react';
import communityImg from "./assets/community2-removebg-preview.png";
import twitterIcon from "./assets/twitter.svg";
import googleIcon from "./assets/google.svg";
import facebookIcon from "./assets/facebook.svg";
import eyeOpenIcon from "./assets/eye-open.svg";
import eyeClosedIcon from "./assets/eye-closed.svg";
import mailIcon from "./assets/mail.svg";
import civixLogo from "./assets/civix-logo.png";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef(null);
  return (
    <div className="relative w-[1440px] h-[1024px] bg-[#D7E9ED] rounded-[30px] overflow-hidden mx-auto my-4">
      {/* Ellipse 1 */}
      <div className="absolute w-[1463px] h-[1294px] left-[555px] top-[-307px] bg-[#CBDEEC] rounded-full"></div>

      {/* Rectangle 1 */}
      <div
        className="absolute w-[97px] h-[514px] left-[1343px] top-0"
        style={{
          background:
            "linear-gradient(182.37deg, #64B3AD 5.78%, #407470 38.95%, #2B4D4A 94.22%)",
        }}
      ></div>

      {/* Rectangle 2 */}
      <div
        className="absolute w-[97px] h-[514px] left-[1343px] top-[514px]"
        style={{ background: "linear-gradient(178.33deg, #33556E 0.26%, #64B3AD 84.92%)" }}
      ></div>

      {/* Ellipse 4 */}
      <div
        className="absolute w-[163px] h-[156px] left-[46px] top-[423px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #4BA49C 0%, #64B3AC 100%)",
          filter: "blur(40px)",
        }}
      ></div>

      {/* Rectangle 3 - main panel */}
      <div
        className="absolute left-[136px] top-[148px] w-[1088px] h-[702px] bg-[#D9D9D9] opacity-60 border border-[#407470] rounded-[40px]"
        style={{ boxShadow: "0px 4px 50px 15px rgba(0,0,0,0.25)" }}
      ></div>

      {/* CIVIX 2 */}
      <div
        className="absolute w-[450px] h-[450px] left-[-119px] top-[-176px] z-50 pointer-events-none"
        style={{
          backgroundImage: `url(${civixLogo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>

      {/* community2 1 - background image block */}
      <div
        className="absolute left-[128px] top-[286px] w-[576px] h-[383px]"
        style={{
          backgroundImage: `url(${communityImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.32,
        }}
      ></div>

      {/* Welcome Back ! */}
      <div
        className="absolute left-[618px] top-[192px] w-[168px] h-[25px] flex items-center justify-center"
        style={{ fontFamily: '"Baskerville Old Face", serif' }}
      >
        <span className="text-[25px] leading-[25px] text-black">Welcome Back !</span>
      </div>

      {/* Subheading */}
      <div
        className="absolute left-[459px] top-[217px] w-[487px] h-[12px] flex items-center justify-center"
        style={{ fontFamily: '"Baumans", cursive' }}
      >
        <span className="text-[14px] leading-[17px] text-black">
          Log in to make your voice heard in your community.
        </span>
      </div>

      {/* Log-in title */}
      <div
        className="absolute left-[865px] top-[279px] w-[81px] h-[33px] flex items-center justify-center"
        style={{ fontFamily: '"Jacques Francois", serif' }}
      >
        <span className="text-[25px] leading-[33px] text-black">Log-in</span>
      </div>

      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        className="absolute left-[680px] top-[340px] w-[459px] h-[63px] rounded-[30px] pl-12 pr-6 bg-[rgba(43,108,99,0.1)] text-black placeholder-black caret-black outline-none border-2 border-black focus:border-black focus:ring-0 shadow-none"
        style={{ color: '#000000', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif', textIndent: '4px' }}
        ref={emailInputRef}
      />

      {/* Email field mail icon (focus email on click) */}
      <button
        type="button"
        className="absolute left-[1105px] top-[362px] w-[20px] h-[20px] bg-transparent hover:bg-transparent flex items-center justify-center focus:outline-none outline-none border-0 hover:border-0 focus:ring-0 hover:ring-0 z-10 cursor-pointer"
        aria-label="Focus email field"
        onClick={() => emailInputRef.current && emailInputRef.current.focus()}
      >
        <img
          src={mailIcon}
          alt=""
          aria-hidden="true"
          className="w-[20px] h-[20px] select-none"
        />
      </button>

      {/* Password input */}
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        className="absolute left-[681px] top-[451px] w-[459px] h-[63px] rounded-[30px] px-6 bg-[rgba(43,108,99,0.1)] text-black placeholder-black caret-black outline-none border-2 border-black focus:border-black focus:ring-0 shadow-none"
        style={{ color: '#000000', fontFamily: '"Phetsarath OT", "Phetsarath", sans-serif' }}
      />

      {/* Password visibility toggle (eye) */}
      <button
        type="button"
        className="absolute left-[1105px] top-[472px] w-[20px] h-[20px] rounded-full bg-transparent hover:bg-transparent flex items-center justify-center focus:outline-none outline-none border-0 hover:border-0 focus:ring-0 hover:ring-0 z-10 cursor-pointer"
        aria-label="Toggle password visibility"
        aria-pressed={showPassword}
        onClick={() => setShowPassword((v) => !v)}
      >
        <img
          src={showPassword ? eyeOpenIcon : eyeClosedIcon}
          alt={showPassword ? 'Hide password' : 'Show password'}
          className="w-[20px] h-[20px]"
        />
      </button>

      {/* Forgot Password ? */}
      <button
        type="button"
        className="absolute left-[1013px] top-[542px] inline-flex items-center justify-center text-black hover:underline focus:outline-none focus:ring-0 hover:ring-0 outline-none hover:outline-none border-0 hover:border-0 rounded cursor-pointer whitespace-nowrap bg-transparent p-0 m-0"
        style={{ fontFamily: '"Copperplate Gothic Light", serif' }}
        onClick={() => alert('Forgot Password clicked')}
        aria-label="Forgot Password"
      >
        <span className="text-[12px] leading-[13px]" style={{ color: '#000000' }}>Forgot Password ?</span>
      </button>

      {/* Log-in button */}
      <button
        type="button"
        className="absolute left-[826px] top-[579px] w-[167px] h-[52px] rounded-[30px] bg-[#2B4D4A] flex items-center justify-center"
        style={{ fontFamily: '"Jacques Francois", serif' }}
        onClick={() => alert('Log-in clicked')}
      >
        <span className="text-[20px] leading-[26px] text-[#D7E9ED]">Log-in</span>
      </button>

      {/* Divider line */}
      <div className="absolute left-[688px] top-[643px] w-[452px] border border-black"></div>

      {/* Social buttons */}
      <button
        type="button"
        className="absolute left-[704px] top-[693px] w-[41px] h-[41px] rounded-full bg-transparent hover:bg-transparent flex items-center justify-center hover:shadow-md focus:outline-none focus:ring-0 hover:ring-0 outline-none hover:outline-none border-0 hover:border-0 cursor-pointer"
        aria-label="Continue with Google"
        onClick={() => alert('Google button clicked')}
      >
        <img src={googleIcon} alt="Google" className="w-[24px] h-[24px]" />
      </button>
      <button
        type="button"
        className="absolute left-[890px] top-[693px] w-[41px] h-[41px] rounded-full bg-transparent hover:bg-transparent flex items-center justify-center hover:shadow-md focus:outline-none focus:ring-0 hover:ring-0 outline-none hover:outline-none border-0 hover:border-0 cursor-pointer"
        aria-label="Continue with Facebook"
        onClick={() => alert('Facebook button clicked')}
      >
        <img src={facebookIcon} alt="Facebook" className="w-[24px] h-[24px]" />
      </button>

      {/* Twitter button */}
      <button
        type="button"
        className="absolute left-[1076px] top-[693px] w-[41px] h-[41px] rounded-full bg-transparent hover:bg-transparent flex items-center justify-center hover:shadow-md focus:outline-none focus:ring-0 hover:ring-0 outline-none hover:outline-none border-0 hover:border-0 cursor-pointer"
        aria-label="Continue with Twitter"
        onClick={() => alert('Twitter button clicked')}
      >
        <img src={twitterIcon} alt="Twitter" className="w-[24px] h-[24px]" />
      </button>

      {/* New to CIVIX? Create an Account (single line; only 'Create an Account' is a link) */}
      <div
        className="absolute left-[775px] top-[761px] h-[20px] flex items-center justify-center whitespace-nowrap"
        style={{ fontFamily: '"Protest Strike", sans-serif' }}
      >
        <span className="text-[17px] leading-[19px] text-black">New to CIVIX?&nbsp;</span>
        <a
          href="#"
          className="text-[17px] leading-[19px] text-[#2B4D4A] hover:text-[#2B4D4A] focus:text-[#2B4D4A] underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[#2B4D4A] cursor-pointer"
          aria-label="Create an Account"
          onClick={(e) => { e.preventDefault(); console.log('Create an Account link clicked'); }}
        >
          Create an Account
        </a>
      </div>

      {/* Decorative ellipses */}
      <div className="absolute w-[316px] h-[279px] left-[-92px] top-[835px] bg-[#CBDEEC] rounded-full"></div>
      <div
        className="absolute w-[163px] h-[156px] left-[-57px] top-[-56px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #2B4D4A 0%, #64B3AC 100%)",
          boxShadow: "0px 4px 80px rgba(0, 0, 0, 0.25)",
        }}
      ></div>
      <div
        className="absolute w-[163px] h-[156px] left-[702px] top-[950px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #2B4D4A 0%, #64B3AC 100%)",
          boxShadow: "0px 4px 80px rgba(0,0,0,0.25)",
        }}
      ></div>

      {/* Optional translucent ellipse */}
      <div
        className="absolute w-[1463px] h-[1294px] left-[2169.3px] top-[-283px]"
        style={{
          background: "rgba(203, 222, 236, 0.1)",
          boxShadow:
            "inset 91.9px -91.9px 91.9px rgba(154, 169, 179, 0.1), inset -91.9px 91.9px 91.9px rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(40.436px)",
        }}
      ></div>
    </div>
  );
}
