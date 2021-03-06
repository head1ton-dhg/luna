import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'redux-react-hook';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

import { ControlTypes } from 'components/common';
import { addInstallOption } from 'models/common/actions';
import {
  installPackage,
  installMultiplePackages,
} from 'models/packages/actions';
import { iMessage } from 'commons/utils';

import styles from './styles';
import { PACKAGE_GROUPS } from 'constants/AppConstants';

const groups = Object.values(PACKAGE_GROUPS);

const Controls = ({ classes, packageName, onSelect }) => {
  const [groupName, setGroup] = useState('save-prod');

  return (
    <FormGroup row>
      <FormControl className={classes.formControl}>
        <Select
          value={groupName}
          onChange={(e) => {
            const { value } = e.target;

            setGroup(value);
            onSelect({
              name: packageName,
              options: [value],
            });
          }}
        >
          {groups.map((group) =>
            group !== 'save-exact' ? (
              <MenuItem key={`group${group}`} value={group}>
                {group}
              </MenuItem>
            ) : null
          )}
        </Select>
      </FormControl>
      <FormControlLabel
        className={classes.formControl}
        control={
          <Checkbox
            onChange={() =>
              onSelect({
                name: packageName,
                options: ['save-exact'],
              })
            }
            value="save-exact"
          />
        }
        label="exact"
      />
    </FormGroup>
  );
};

Controls.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  packageName: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const WithStylesControls = withStyles(styles)(Controls);

const InstallationOptions = ({
  classes,
  active,
  selected,
  isOpen,
  single,
  version,
  onClose,
}) => {
  const dispatch = useDispatch();
  const packages = selected.length ? selected : active ? [active.name] : [];

  const onInstallPackage = () =>
    dispatch(
      installPackage({
        ipcEvent: 'npm-install',
        cmd: ['install'],
        name: active.name,
        single: true,
        version,
      })
    );

  const onInstallMultiplePackages = () => {
    dispatch(
      installMultiplePackages({
        ipcEvent: 'npm-install',
        cmd: selected.map(() => 'install'),
        multiple: true,
        packages: selected,
      })
    );
  };

  return (
    <Dialog
      open={isOpen}
      fullWidth
      onClose={onClose}
      aria-labelledby="install-options"
    >
      <DialogContent>
        <div>
          <Typography variant="subtitle1" className={classes.title}>
            {iMessage('title', 'installationOptions')}
          </Typography>
          <Divider />
          <List dense className={classes.list}>
            {packages.map((packageName) => (
              <ListItem key={packageName}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1">{packageName}</Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <WithStylesControls
                    packageName={packageName}
                    onSelect={({ name, options }) =>
                      dispatch(
                        addInstallOption({
                          name,
                          options,
                        })
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (single) {
              onInstallPackage();
            } else {
              onInstallMultiplePackages();
            }

            onClose();
          }}
          color="primary"
          autoFocus
        >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

InstallationOptions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(InstallationOptions);
