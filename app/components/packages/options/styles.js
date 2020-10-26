import { darken } from '@material-ui/core/styles/colorManipulator';
import { defaultFont, flexContainer, grayColor } from 'styles/variables';

const styles = (theme) => ({
  list: {
    width: '100%',
  },
  flexContainer: {
    ...flexContainer,
  },
  title: {
    ...defaultFont,
    paddingBottom: 4,
    fontSize: 18,
    display: 'flex',
    color: darken(grayColor, 0.2),
    flexDirection: 'column',
  },
  formControl: {
    padding: theme.spacing(2),
    minWidth: 120,
  },
});

export default styles;
