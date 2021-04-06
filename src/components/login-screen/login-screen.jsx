import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../store/api-actions";
import {Redirect} from "react-router-dom";

import Header from '../../layout/header';
import Footer from '../../layout/footer';
import {AppRoutes, SetAuthStatus, SetErrors} from "../../const";
import {setError} from "../../store/actions";

const LoginScreen = () => {
  const {authorizationStatus} = useSelector((state) => state.USER);
  const {error} = useSelector((state) => state.ERROR);

  const loginRef = useRef();
  const passwordRef = useRef();

  const dispatch = useDispatch();

  if (authorizationStatus === SetAuthStatus.AUTH) {
    return <Redirect to={AppRoutes.ROOT} />;
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (!loginRef.current.value || !(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/i.test(loginRef.current.value))) {
      dispatch(setError(SetErrors.LOGIN_ERROR));
    } else if (!passwordRef.current.value) {
      dispatch(setError(SetErrors.PASSWORD_ERROR));
    } else {
      dispatch(login({
        login: loginRef.current.value,
        password: passwordRef.current.value
      }));
    }
  };

  return (
    <div className="user-page">

      <Header setClassName="user-page__head">
        <h1 className="page-title user-page__title">Sign in</h1>
      </Header>

      <div className="sign-in user-page__content">
        {error ? (<div className="sign-in__message"><p>{error}</p></div>) : ``}
        <form
          onSubmit={handleSubmit}
          action="#"
          className="sign-in__form"
        >
          <div className="sign-in__fields">
            <div className="sign-in__field">
              <input
                ref={loginRef}
                className="sign-in__input"
                style={error.code === 2 ? {border: `1px solid red`} : null}
                type="email"
                placeholder="Email address"
                name="user-email"
                id="user-email"
              />
              <label className="sign-in__label visually-hidden" htmlFor="user-email">Email address</label>
            </div>
            <div className="sign-in__field">
              <input
                ref={passwordRef}
                className="sign-in__input"
                type="password"
                placeholder="Password"
                name="user-password"
                id="user-password"
              />
              <label className="sign-in__label visually-hidden" htmlFor="user-password">Password</label>
            </div>
          </div>
          <div className="sign-in__submit">
            <button className="sign-in__btn" type="submit">Sign in</button>
          </div>
        </form>
      </div>

      <Footer/>
    </div>
  );
};

export default LoginScreen;
