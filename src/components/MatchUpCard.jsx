import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Select,
} from '@chakra-ui/react';
import MultiSelect from './MultiSelect';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

function MatchUpCard() {
  return (
    <Card backgroundColor={'lightgray'} marginLeft={10} width={'45vw'}>
      <SimpleGrid columns={2} spacing={10}>
        <Box backgroundColor={'lightblue'} height={'70vh'}>
          <CardHeader>
            <SimpleGrid columns={2} marginBottom={5}>
              <Avatar src="https://bit.ly/sage-adebayo" />
              <Button
                // isLoading
                loadingText="Loading"
                colorScheme="teal"
                variant="outline"
                size="lg"
              >
                TOR
              </Button>
            </SimpleGrid>
            <Box>
              <Heading size="sm">Trail Blazers (4-12)</Heading>
              <Text>2023-11-28 / 3:30 PM</Text>
            </Box>
          </CardHeader>
          <CardBody padding={1}>
            <Text as="mark">Starting</Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'} marginBottom={7}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text as="mark" fontSize="1.3rem">
              may not play
            </Text>
            <MultiSelect></MultiSelect>
            <Button
              // isLoading
              loadingText="Loading"
              colorScheme="teal"
              variant="outline"
              size="md"
            >
              확인
            </Button>
            {/* <Text fontSize="1.2rem" color={'red'}>
              선수이름
            </Text> */}
          </CardBody>
        </Box>
        <Box backgroundColor={'lightblue'} height={'70vh'}>
          <CardHeader>
            <SimpleGrid columns={2} marginBottom={5}>
              <Avatar src="https://bit.ly/sage-adebayo" />
              <Button
                // isLoading
                loadingText="Loading"
                colorScheme="teal"
                variant="outline"
                size="lg"
              >
                TOR
              </Button>
            </SimpleGrid>
            <Box>
              <Heading size="sm">Trail Blazers (4-12)</Heading>
              <Text>2023-11-28 / 3:30 PM</Text>
            </Box>
          </CardHeader>
          <CardBody padding={0}>
            <Text as="mark">Starting</Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text fontSize="1.5rem" fontStyle={'bold'} marginBottom={7}>
              PG :{' '}
              <Select placeholder="Select option" size="xs">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </Text>
            <Text as="mark" fontSize="1.7rem">
              may not play
            </Text>
            <Text fontSize="1.5rem" color={'red'}>
              선수이름
            </Text>
          </CardBody>
        </Box>
      </SimpleGrid>
      <Box height="10vh">
        <Text fontSize="1.3rem" textAlign="center">
          handi : ~~~ || under/over : ~~
        </Text>
        <Text fontSize="1.3rem" textAlign="center">
          Referre : ~~~
        </Text>
      </Box>
    </Card>
  );
}

export default MatchUpCard;
