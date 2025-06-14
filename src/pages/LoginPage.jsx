import { useRef, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const LoginPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  const userRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  useEffect(() => {
    setValidName(user.length > 0);
    setValidPwd(pwd.length > 0);
  }, [user, pwd]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validName || !validPwd) {
      toast.error('Please fill in all fields');
      return;
    }

    const toastId = toast.loading('Logging in...');
    
    try {
      const result = await login(user, pwd);
      
      if (result.success) {
        toast.update(toastId, {
          render: 'Login successful!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
        
        navigate(from, { replace: true });
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.update(toastId, {
        render: error.message || 'Login failed!',
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
              Login
            </h2>

            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="block text- font-bold mb-2"
              >
                Username
                <FaCheck className={validName ? "text-green-500 inline-block ml-1" : "hidden"}/>
                <FaTimes className={validName || !user ? "hidden" : "text-orange-600 inline-block ml-1"}/>
              </label>
              <input
                type="text"
                id="username"
                ref={userRef} // set focus on the input
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
                Please enter your username.
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
                Please enter your password.
              </p>
            </div>

            <button
              className={`bg-[var(--card)] text-[var(--background)] font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${!validName || !validPwd ? '' : 'hover:bg-[var(--text)]'}`}
              disabled={!validName || !validPwd}
            >
              Login
            </button>

            <div className="mt-4 text-center">
              <p>Don't have an account yet?</p>
              <Link 
                to={'/register'} 
                className="underline text-orange-600"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default LoginPage