import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";

import axios from '../api/axios'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL = '/register'

const RegisterPage = ({ setIsLoggedIn }) => {
  const userRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatchPwd, setValidMatchPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  // every time the pwd changes, the matchPwd will be checked
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatchPwd(match);
  }, [pwd, matchPwd]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      toast.error('Invalid username or password');
      return;
    }
    
    try {
      const response = await axios.post(
        REGISTER_URL, 
        JSON.stringify({user, pwd}),
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      setIsLoggedIn(true);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      if (!err?.response) {
        toast.error('No server response');
      } else if (err.response?.status === 409) {
        toast.error('Username already exists');
      } else {
        toast.error('Registration failed');
      }
    }
  }

  return (
    <>
      <section className="bg-indigo-50">
        <div className="container m-auto max-w-lg py-24">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <form onSubmit={handleSubmit}>
              <h2 className="text-3xl text-center font-semibold mb-6">
                Register
              </h2>

              <div className="mb-4">
                <label 
                  htmlFor="username" 
                  className="block text-gray-700 font-bold mb-2"
                >
                  Username
                  <FaCheck className={validName ? "text-green-500 inline-block ml-1" : "hidden"}/>
                  <FaTimes className={validName || !user ? "hidden" : "text-orange-600 inline-block ml-1"}/>
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef} // set focus on the input
                  autoComplete="off"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="john_doe"
                  required
                  onChange={(e) => setUser(e.target.value)}
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={userFocus && !validName ? "relative bottom-[-10px]" : "absolute left-[-9999px]"}>
                  <FaInfoCircle className="inline-block mr-1"/>
                  Username must be 4-24 characters long and start with a letter. <br />
                  Only letters, numbers, hyphens, and underscores are allowed.
                </p>
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                  <FaCheck className={validPwd ? "text-green-500 inline-block ml-1" : "hidden"}/>
                  <FaTimes className={validPwd || !pwd ? "hidden" : "text-orange-600 inline-block ml-1"}/>
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="•••••••••"
                  required
                  onChange={(e) => setPwd(e.target.value)}
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "relative bottom-[-10px]" : "absolute left-[-9999px]"}>
                  <FaInfoCircle className="inline-block mr-1"/>
                  Password must be 9-25 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                </p>
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="confirm_pwd" 
                  className="block text-gray-700 font-bold mb-2"
                >
                  Confirm Password
                  <FaCheck className={validMatchPwd && matchPwd ? "text-green-500 inline-block ml-1" : "hidden"}/>
                  <FaTimes className={validMatchPwd || !matchPwd ? "hidden" : "text-orange-600 inline-block ml-1"}/>
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  autoComplete="off"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="•••••••••"
                  required
                  onChange={(e) => setMatchPwd(e.target.value)}
                  aria-invalid={validMatchPwd ? "false" : "true"}
                  aria-describedby="matchpwdnote"
                  onFocus={() => setMatchPwdFocus(true)}
                  onBlur={() => setMatchPwdFocus(false)}
                />
                <p id="matchpwdnote" className={matchPwdFocus && !validMatchPwd ? "relative bottom-[-10px]" : "absolute left-[-9999px]"}>
                  <FaInfoCircle className="inline-block mr-1"/>
                  Passwords must match.
                </p>
              </div>

              <button
                className={`bg-indigo-500 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${!validName || !validPwd || !validMatchPwd ? '' : 'hover:bg-indigo-600'}`}
                disabled={!validName || !validPwd || !validMatchPwd}
              >
                Register
              </button>

              <div className="mt-4 text-center">
                <p>Already have an account?</p>
                <Link to={'/login'} className="underline text-orange-600">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default RegisterPage