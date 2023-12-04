import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { Amplify } from 'aws-amplify';
import awsmobile from "./aws-exports"

// import amplifyconfig from './amplifyconfiguration.json';


// import { Authenticator } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { RecoilDevTools } from "recoil-toolkit";
import SchedulePage from './pages/SchedulePage';
import TeamPage from './pages/TeamPage';
import TeamInfo from './pages/TeamInfo';

// Amplify.configure(amplifyconfig);
Amplify.configure(awsmobile)

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider>
  <QueryClientProvider client={queryClient}>
  {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
    <BrowserRouter>
      <RecoilRoot>
        <RecoilDevTools forceSerialize={false} />
        <Routes>
          {/* 나중에 routes.js파일 만들어서 path들 전역변수로 바꿔주기 */}
          <Route path="/" element={<SchedulePage />} />
          <Route path="/:abbrev" element={<TeamPage />} />
          <Route path="/:abbrev/info" element={<TeamInfo />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  <ReactQueryDevtools/>
</QueryClientProvider>
</ChakraProvider>
   
  );
}

export default App;
