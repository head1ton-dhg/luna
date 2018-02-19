/**
 * CardHeader component
 *
 */

import { CardHeader as MuiCardHeader } from 'material-ui/Card'
import { APP_MODES } from 'constants/AppConstants'
import React from 'react'
import PropTypes from 'prop-types'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import IconButton from 'material-ui/IconButton'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { ListItemText } from 'material-ui/List'
import Select from 'material-ui/Select'
import Checkbox from 'material-ui/Checkbox'

const { object } = PropTypes

class CardHeader extends React.Component {
  constructor() {
    super()
    this._anchorEl = null

    this.state = {
      options: []
    }

    this.buildTitle = this.buildTitle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange = (event) => {
    this.setState({ options: event.target.value })
  }
  buildTitle() {
    const { active, group, actions } = this.props
    const { name, author, version } = active
    return group ? `${name} - ${group}` : name
  }
  buildOptions() {
    const { mode, cmdOptions } = this.props

    return cmdOptions.map((opt) => (
      <MenuItem key={opt} value={opt}>
        <Checkbox checked={this.state.options.indexOf(name) > -1} />
        <ListItemText primary={opt} />
      </MenuItem>
    ))
  }
  handleClick(e) {
    this._anchorEl = e.currentTarget
    this.forceUpdate()
  }
  handleClose() {
    this._anchorEl = null
    this.forceUpdate()
  }
  render() {
    const ITEM_HEIGHT = 55
    const ITEM_PADDING_TOP = 8
    const anchorEl = this._anchorEl
    const { classes, active, actions, mode, onChangeVersion } = this.props
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: 150
        }
      }
    }

    if (!active) {
      return null
    }

    return (
      <section>
        <MuiCardHeader
          avatar={
            <Avatar aria-label={active.name} className={classes.avatar}>
              {active.name[0].toUpperCase()}
            </Avatar>
          }
          action={
            <div style={{ marginLeft: 'auto' }}>
              <IconButton
                aria-label="More"
                aria-owns={anchorEl ? 'long-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
                className={classes.iconbutton}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 200
                  }
                }}
              >
                <MenuItem key="item-a" onClick={(e) => console.log(e)}>
                  Action_A
                </MenuItem>
              </Menu>
            </div>
          }
          title={this.buildTitle()}
          subheader={active.version}
        />
        <div className={classes.headerActions}>
          <TextField
            select
            label="Select Version"
            className={classes.textField}
            value={active.version}
            onChange={onChangeVersion}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            helperText="preview the selected version"
            margin="normal"
          >
            {active &&
              active.versions.map((version, key) => (
                <MenuItem key={key} value={version}>
                  {version}
                </MenuItem>
              ))}
          </TextField>
          {mode === APP_MODES.LOCAL ? (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox">
                Options
              </InputLabel>
              <Select
                multiple
                value={this.state.options}
                onChange={this.handleChange}
                input={<Input id="select-options" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {this.buildOptions()}
              </Select>
            </FormControl>
          ) : null}
        </div>
      </section>
    )
  }
}

CardHeader.propTypes = {
  classes: object,
  active: object
}

export default CardHeader