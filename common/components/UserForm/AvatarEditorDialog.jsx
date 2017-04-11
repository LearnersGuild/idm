import React, {Component, PropTypes} from 'react'

import Dialog from 'react-toolbox/lib/dialog'
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
    const {user, active, onCancel} = this.props
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
        <div className={styles.dialogContent}>
          <AvatarEditor
            ref={this.setEditorRef}
            image={user.avatarUrl}
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
      </Dialog>
    )
  }
}

AvatarEditorDialog.propTypes = {
  active: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

export default AvatarEditorDialog
