import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const RegisterPage = () => {
  const { register } = useAuth();
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
  
  const [role, setRole] = useState('job_seeker');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  // every time the pwd changes, the matchPwd will be checked
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
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
    
    const toastId = toast.loading('Registering...');

    try {
      const result = await register(user, pwd, role);
      
      if (result.success) {
        toast.update(toastId, {
          render: 'Registration successful!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
        navigate('/');
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.update(toastId, {
        render: error.message || 'Registration failed!',
        type: 'error',
        isLoading: false,
        autoClose: 2000
      });
      throw error;
    }
  }

  return (
    <section className="bg-[var(--hover)] py-10">
      <div className="container m-auto max-w-xl px-4">
        <Card>
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl md:text-3xl text-center font-semibold mb-6">
              Register
            </h2>

            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="block text-[var(--card)] font-bold mb-2"
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
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
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
                className="block text-[var(--card)] font-bold mb-2"
              >
                Password
                <FaCheck className={validPwd ? "text-green-500 inline-block ml-1" : "hidden"}/>
                <FaTimes className={validPwd || !pwd ? "hidden" : "text-orange-600 inline-block ml-1"}/>
              </label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
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
                className="block text-[var(--card)] font-bold mb-2"
              >
                Confirm Password
                <FaCheck className={validMatchPwd && matchPwd ? "text-green-500 inline-block ml-1" : "hidden"}/>
                <FaTimes className={validMatchPwd || !matchPwd ? "hidden" : "text-orange-600 inline-block ml-1"}/>
              </label>
              <input
                type="password"
                id="confirm_pwd"
                autoComplete="off"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
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

            <div className="mb-6">
              <label className="block text-[var(--card)] font-bold mb-2">
                I want to:
              </label>
              <div className="flex flex-col space-y-3">
                <label className="inline-flex items-center p-3 border rounded-lg border-gray-300 bg-[var(--hover)]">
                  <input
                    type="radio"
                    name="role"
                    value="job_seeker"
                    checked={role === 'job_seeker'}
                    onChange={() => setRole('job_seeker')}
                    className="h-5 w-5 text-[var(--card)]"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Find Jobs</span>
                    <p className="text-sm text-gray-500">
                      Register as a job seeker to browse and apply for jobs
                    </p>
                  </div>
                </label>
                
                <label className="inline-flex items-center p-3 border rounded-lg border-gray-300 bg-[var(--hover)]">
                  <input
                    type="radio"
                    name="role"
                    value="job_poster"
                    checked={role === 'job_poster'}
                    onChange={() => setRole('job_poster')}
                    className="h-5 w-5 text-[var(--card)]"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Post Jobs</span>
                    <p className="text-sm text-gray-500">
                      Register as an employer to post and manage job listings
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              className={`bg-[var(--card)] text-[var(--background)] font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${!validName || !validPwd || !validMatchPwd ? '' : 'hover:bg-[var(--text)]'}`}
              disabled={!validName || !validPwd || !validMatchPwd}
            >
              Register
            </button>

            <div className="mt-4 text-center">
              <p>Already have an account?</p>
              <Link to={'/login'} className="underline text-[var(--red)]">Sign in</Link>
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default RegisterPage