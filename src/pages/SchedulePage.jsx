import React from 'react';
import MatchUpCard from '../components/MatchUpCard';
import { Box, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import NavBar from '../components/NavBar';

function SchedulePage() {
  return (
    <>
      <Box bg="black" w="100%" p={8} color="white">
        <NavBar></NavBar>
      </Box>

      <SimpleGrid columns={2} spacingX="0px" spacingY="10vh" marginTop={20}>
        <MatchUpCard />
        <MatchUpCard />
        <MatchUpCard />
        <MatchUpCard />
      </SimpleGrid>
    </>
  );
}

export default SchedulePage;
