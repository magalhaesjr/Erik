// Returns the pool sheet header table
import { Typography } from '@mui/material';
import MainDiv from '../MainDiv';

type PoolInfoProps = {
  inputCourt: number[];
  division: string;
};

const PoolInfo = ({ inputCourt, division }: PoolInfoProps) => {
  return (
    <MainDiv>
      <Typography
        variant="h4"
        width="50%"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        {division}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: 'black',
          display: 'inline-block',
        }}
      >
        {`Court ${inputCourt[0]}`}
      </Typography>
    </MainDiv>
  );
};

export default PoolInfo;
