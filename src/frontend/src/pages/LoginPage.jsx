import { useForm } from 'react-hook-form';
import { auth } from 'lib/firebase';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useRegister from '../hooks/useRegister';
import Image from 'next/image';
import axios from 'axios';
import Layout from '../components/layout';

function Home() {
  setPersistence(auth, browserLocalPersistence);
  const router = useRouter();
  const { register: registerMethod } = useRegister();
  const [loginError, setLoginError] = useState(null);

  const { register, handleSubmit } = useForm();

  async function reroute(userId) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/dashboard/getUserById?userId=${userId}`,
    );
    console.log('role:', data.roleEnum);
    const accountType = data.roleEnum.toLowerCase();

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/dashboard/${accountType}/getByUserId?userId=${userId}`,
    );
    console.log('data: ', response.data);
    // TODO: remove null check, only here since existing database rows have null
    if (
      response.data[0].introComplete === true ||
      response.data[0].introComplete === null
    ) {
      router.push('/dashboard');
    } else {
      router.push(`/accountPending`);
    }
  }

  const onSubmit = async (data) => {
    try {
      await auth.setPersistence(browserLocalPersistence);
      // Attempt to sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      console.log('auth: ', auth);
      reroute(auth.currentUser.uid);
      // router.push('/dashboard');
      // route them to the dashboard
    } catch (error) {
      // Handle authentication errors here
      console.error('Authentication error:', error);
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Layout name="Register">
      <div className="flex flex-col justify-center items-center ">
        <Image alt="Immigr8 logo" src="/logo.png" width={200} height={200} />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8">
        <div className=" sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 rounded-2xl border-2 border-gray-300 shadow-lg sm:px-12 mb-10">
            <h1 className=" text-4xl mb-5">Login</h1>
            <form className="space-y-6" onSubmit={handleSubmit(registerMethod)}>
              <div>
                <div className=" text-center text-red-500 mb-5">
                  {loginError}
                </div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    {...register('email')}
                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-700"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...register('password')}
                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-blue-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                {/* <p className="text-center text-sm mt-3">Don&apos;t have an account? <a href={'/register'} className="text-blue hover:underline">Signup</a></p> */}
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-normal leading-6 text-white shadow-sm hover:shadow-lg mt-5"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
