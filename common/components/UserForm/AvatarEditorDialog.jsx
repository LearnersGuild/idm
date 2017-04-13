import React, {Component, PropTypes} from 'react'

import Dialog from 'react-toolbox/lib/dialog'
import {List, ListItem} from 'react-toolbox/lib/list'

import Slider from 'react-toolbox/lib/slider'
import AvatarEditor from 'react-avatar-editor'

import styles from './AvatarEditorDialog.css'

class AvatarEditorDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {zoom: 1.0}
    this.handleZoom = this.handleZoom.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.setEditorRef = this.setEditorRef.bind(this)
  }

  setEditorRef(editor) {
    this.editor = editor
  }

  handleZoom(zoom) {
    this.setState({zoom})
  }

  handleSave() {
    const canvas = this.editor.getImage()
    const imageURL = canvas.toDataURL('image/jpeg')
    this.props.onSave(imageURL)
  }

  render() {
    const {image, active, onCancel} = this.props
    const actions = [{
      label: 'Cancel', onClick: onCancel,
    }, {
      label: 'Save', onClick: this.handleSave,
    }]

    return (
      <Dialog
        actions={actions}
        active={active}
        onEscKeyDown={this.handleCancel}
        onOverlayClick={this.handleCancel}
        title="Edit Your Avatar"
        >
        <div className={styles.editor}>
          <AvatarEditor
            ref={this.setEditorRef}
            image={image}
            width={200}
            height={200}
            scale={this.state.zoom}
            style={{marginLeft: '20px'}}
            />
          <Slider
            min={0}
            max={10}
            step={0.25}
            onChange={this.handleZoom}
            value={this.state.zoom}
            />
        </div>
        <div className={styles.instructions}>
          <List>
            <ListItem caption="Drag a new photo onto the box" leftIcon="navigate_next"/>
            <ListItem caption="Zoom using the slider" leftIcon="navigate_next"/>
            <ListItem caption="Move the image to center it" leftIcon="navigate_next"/>
          </List>
        </div>
      </Dialog>
    )
  }
}

AvatarEditorDialog.propTypes = {
  active: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default AvatarEditorDialog
