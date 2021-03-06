/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from '../styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import { PorcupineWorkerFactory } from '@picovoice/porcupine-web-en-worker';
import { usePorcupine } from '@picovoice/porcupine-web-react';
import { useEffect, useState } from 'react';
import mirrorImg from '../imgs/mirror.jpg';
import mirror2Img from '../imgs/2.png';
import { RhinoWorkerFactory } from '@picovoice/rhino-web-en-worker';
import { useRhino } from '@picovoice/rhino-web-react';

const accessKey = '3Cdt5+d1/9oHiFxG0/upa4QUD68m+N4/96nULkH8A98ErWDrUC3KQA=='; // AccessKey obtained from [Picovoice Console](https://picovoice.ai/console/)

export function App() {
  const keywordEventHandler = React.useCallback(keywordLabel => {
    console.log(`Porcupine detected ${keywordLabel}`);
    setMirrorStatus(true);
  }, []);

  const [mirrorStatus, setMirrorStatus] = useState(false);

  const [keywords] = useState([
    {
      base64:
        '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',
      custom: 'magical mirror',
      sensitivity: 0.6,
    },
  ]);

  // const keywords = [{ builtin: 'Picovoice', sensitivity: 0.65 }];

  const [latestInference, setLatestInference] = useState(null);
  const [reg, setReg] = useState(false);

  const inferenceEventHandler = rhinoInference => {
    console.log(`Rhino inferred:`, rhinoInference);
    if (rhinoInference?.isUnderstood) {
      setReg(true);
      setMirrorStatus(true);
    }
    setLatestInference(rhinoInference);
  };

  const {
    contextInfo,
    isLoaded: isLoaded2,
    isTalking,
    pushToTalk,
  } = useRhino(
    RhinoWorkerFactory,
    {
      accessKey: accessKey,
      context: {
        sensitivity: 0.6,
        base64:
          'cmhpbm8yLjEuMNEaAAAkAAAAZDI3OTRkZmUtYjM5Yi00Nzc0LThmZWItMjZjMzYwZDZlMDMx//////////8AAAAABAQAAGVhY29udGV4dDoKICBleHByZXNzaW9uczoKICAgIHNob3c6CiAgICAgIC0gIkBiIFtpcywgYXJlXSAodGhlKSAobW9zdCkgYmVhdXRpZnVsIChnaXJsKSIKICAgIGIyOgogICAgICAtICJAYiBbaXMsIGFyZV0gKHRoZSkgKG1vc3QpIGNvb2wgKGJveSkiCiAgc2xvdHM6IHt9CiAgbWFjcm9zOgogICAgYjoKICAgICAgLSB3aG8KAAkAAAAAAAAABAAAAA4AAAASAAAAFwAAABwAAAAfAAAAJAAAACgAAAAsAAAAYXJlAGJlYXV0aWZ1bABib3kAY29vbABnaXJsAGlzAG1vc3QAdGhlAHdobwAAAAAAAgAAAAMAAAAEAAAABQAAAAYAAAAHAAAACQAAAAsAAAAMAAAAAAAAAAIAAAADAAAACwAAAA0AAAAQAAAAEwAAABUAAAAZAAAAHAAAAB4AAAAgAAAAIgAAAAEcDAclIh8DDgMVBxoUIhUPDBURJhYZHR8WGR0KAwoSECIAAAgAAAAAAAAAAgAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAFAAAAAAAAAAEAAAACAAAAAwAAAAQAAAAGAAAABwAAAAgAAAAAAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAAAAAAAAAAAAAAAAABAAAAAgAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAAAAAAAAAAAAgAAAAAAAAADAAAACAAAAGIyAHNob3cAAAAAAAAAAAD//////////wEAAAAUAAAAAAAAAAcAAAD/////AQAAACgAAAAUAAAAAAAAAP////8EAAAASAAAAGwAAAAwAQAAkAEAACgAAAABAAAAAQAAAAEAAABcAAAASAAAAAQAAAABAAAAAAAAACgAAAAGAAAA/////wMAAACIAAAArAAAAAwBAABsAAAAAQAAAAEAAAABAAAAnAAAAIgAAAAEAAAAAQAAAAAAAABsAAAABQAAAP////8CAAAAxAAAAOgAAACsAAAAAQAAAAEAAAABAAAA2AAAAMQAAAAEAAAAAQAAAAAAAACsAAAAAwAAAAAAAAABAAAA/AAAAOgAAAACAAAAAAAAAAAAAABsAAAAAwAAAAAAAAABAAAAIAEAAAwBAAACAAAAAAAAAAAAAAAoAAAABQAAAP////8CAAAASAEAAGwBAAAwAQAAAQAAAAEAAAABAAAAXAEAAEgBAAAEAAAAAQAAAAAAAAAwAQAAAwAAAAAAAAABAAAAgAEAAGwBAAACAAAAAAAAAAAAAAAoAAAAAwAAAAAAAAABAAAApAEAAJABAAACAAAAAAAAAAAAAAA=',
      },
      start: true,
    },
    inferenceEventHandler,
  );

  const {
    isLoaded,
    isListening,
    isError,
    errorMessage,
    start,
    pause,
    setKeywordEventHandler,
  } = usePorcupine(
    PorcupineWorkerFactory,
    { accessKey: accessKey, keywords: keywords, start: false },
    keywordEventHandler,
  );

  useEffect(() => {
    if (isError) {
      errorMessage && alert(errorMessage);
    }
  }, [errorMessage, isError]);

  useEffect(() => {
    console.log(isLoaded);
  }, [isLoaded]);

  useEffect(() => {
    setTimeout(() => {
      pushToTalk();
    }, 3000);
  }, [pushToTalk]);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        filter: !mirrorStatus ? 'blur(6px)' : 'none',
      }}
    >
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      {isLoaded ? (
        <>
          <div>
            <img src={mirrorImg} alt="" />
            <img
              src={mirror2Img}
              alt=""
              className="img2"
              style={{ mixBlendMode: !reg ? 'color-dodge' : 'unset' }}
            />
          </div>
        </>
      ) : (
        <>loading...</>
      )}
      <div style={{ display: 'none' }}>
        <p>{JSON.stringify(latestInference)}</p>
        <p>{JSON.stringify(contextInfo)}</p>
      </div>
      <GlobalStyle />
    </div>
  );
}
