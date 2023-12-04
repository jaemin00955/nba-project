import React from 'react';
import { API } from 'aws-amplify';

const getToday = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = ('0' + (1 + date.getMonth())).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};
// async function postTodo() {
//   try {
//     const restOperation = get({
//       apiName: 'nbaApi',
//       path: '/nba',
//     });
//     const response = await restOperation.response;
//     console.log('GET call succeeded: ', response);
//   } catch (error) {
//     console.log('GET call failed: ', error);
//   }
// }
function ScheduleData() {
  // postTodo();
  return <div>ScheduleData</div>;
}

export default ScheduleData;
