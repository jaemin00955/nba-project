import { Box } from '@chakra-ui/react';
import React from 'react';
import NavBar from '../components/NavBar';

function TeamInfo() {
  return (
    <>
      {' '}
      <Box bg="black" w="100%" p={8} color="white">
        <NavBar></NavBar>
      </Box>
      <div>팀 로고+ 팀 이름</div>
      <div>General 스탯-팀 테이블</div>
      <div>팀 코멘트 작성</div>
      <div>General 스탯-선수 테이블</div>
      <div>선수 코멘트 작성</div>
      <div>팀 플레이 타입 스탯 테이블</div>
      <div>팀 플레이 타입 스탯 테이블</div>
    </>
  );
}

export default TeamInfo;
