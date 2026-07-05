import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, Loader2, Shield, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { isLoading, isAuthenticated, login } = useAuth();
  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);


    try {
      await login(email, password);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error?.message  || 'Invalid email or password');
    //   console.error('Login failed:',err?.response?.data?.error?.message );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    




    <div className="min-h-screen flex items-center justify-center bg-background text-on-background px-4">
      <div className="w-full max-w-sm">
        <div className="card shadow-card p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
              Bot Admin
            </h1>
                {/* <p className='my-2 font-bold '>Welcome Back</p> */}
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
             <span className='font-bold text-primary'>Welcome Back!</span> Sign in to your account
            </p>
          </div>

 {error && (
              <div className="text-center text-danger py-2">
                <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
              </div>
            )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5 "
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@example.com"
                disabled={isSubmitting}
                className="border-2 border-outline rounded-md p-2 w-full text-sm"

              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5 "
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="border-2 border-outline rounded-md p-2 w-full text-sm"

              />
            </div>

           

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full cursor-pointer bg-primary p-2 rounded-md my-3 font-semibold"
            >
              {isSubmitting ? (
                <>
                <span className='text-center'>
                    
                  
                  <Loader2 className="animate-spin text-center m-auto" />
                    </span>  
                  
                </>
              ) : (
                  <>
                <div className=''>

                Sign in <ArrowRightIcon className='inline'/>
                </div>
                </>
              )}
            </button>
          </form>

          <p className='text-xs'>
            Don't have admin account? <span className='text-primary font-semibold cursor-pointer'>Register</span>
          </p>

          <div className='text-gray-500 text-xs my-4 text-center'>
            <ShieldCheck size={15} className='inline'/> Secure Login
          </div>
        </div>
      </div>
    </div>

    </>
  );
}
