import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Box } from '@chakra-ui/react';
import ScheduleData from '../components/ScheduleData';
import { API } from 'aws-amplify';
import axios from 'axios';

const func = async () => {
  const a = await API.get('nbaApi', '/nba');
  return a;
};

function TeamPage() {
  const params = useParams();
  // func();
  // ScheduleData();
  // const url =
  //   'https://r6aaf3ejke.execute-api.ap-northeast-2.amazonaws.com/staging/nba';
  // axios.get(url);
  API.post('nbaApi', '/synergy', {
    body: {
      teamId: 1610612737,
    },
  });
  return (
    <>
      <Box bg="black" w="100%" p={8} color="white">
        <NavBar></NavBar>
      </Box>
      <div>{params.abbrev}</div>
      <div>앞에서 선택한 라인업 표시하기</div>
      <div>맞대결 전적(팀)</div>
      <div>맞대결 전적(선수)</div>

      <div>최근 3경기 스탯(팀)</div>
      <div>최근 3경기 스탯(선수)</div>

      <div>general 스탯(팀)</div>
      <div>general 스탯(선수)</div>
      <div>general 스탯 -Min/Max(팀)</div>
      <div>general 스탯- Min/Max(선수)</div>

      <div>플레이 타입 설명(팀)</div>
      <div>6가지 플레이타입중 상위권 선수의 스탯 표현하기</div>
      <div>6가지 플레이타입에 대한 오늘 상대팀의 디펜스 스탯 표현</div>
      <div>6가지 플레이타입에 대한 오늘 상대팀의 디펜스 스탯 표현</div>

      <div>
        매치업 예상 - 해당 팀의 선수와 매치업될 선수의 매치업시 디펜스 스탯
      </div>
    </>
  );
}

export default TeamPage;
