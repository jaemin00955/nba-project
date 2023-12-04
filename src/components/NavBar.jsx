import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Flex column={3}>
      <div
        style={{
          margin: 10,
          width: '10vw',
          height: '5vh',
          border: '6px solid',
          textAlign: 'center',
        }}
      >
        <Link to={'/'}>Main</Link>
      </div>
      <div
        style={{
          margin: 10,
          width: '10vw',
          height: '5vh',
          border: '6px solid',
          textAlign: 'center',
        }}
      >
        <Link to={'/'}>Main</Link>
      </div>
      <div
        style={{
          margin: 10,
          width: '10vw',
          height: '5vh',
          border: '6px solid',
          textAlign: 'center',
        }}
      >
        <Link to={'/'}>Main</Link>
      </div>
    </Flex>
  );
}

export default NavBar;
