
import React, { Component, PropsWithChildren } from 'react'

type FileDataEvent = Event & DragEvent & {
  dataTransfer: {
    items: Array<unknown>,
    files: Array<File>,
    clearData: Function
  }
}

class DragAndDrop extends Component<PropsWithChildren<{ handleDrop: Function }>> {
  dragCounter = 0;
  state = {
    drag: false
  }
  dropRef = React.createRef()
  handleDrag = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  handleDragIn = (e: FileDataEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true })
    }
  }
  handleDragOut = (e: FileDataEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({ drag: false })
    }
  }
  handleDrop = (e: DragEvent & FileDataEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ drag: false })
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      (this.props).handleDrop(e.dataTransfer.files)
      e.dataTransfer.clearData()
      this.dragCounter = 0
    }
  }
  componentDidMount() {
    let div = this.dropRef.current as HTMLElement;
    div.addEventListener('dragenter', this.handleDragIn as (e: Event) => void)
    div.addEventListener('dragleave', this.handleDragOut as (e: Event) => void)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop as (e: Event) => void)
  }
  componentWillUnmount() {
    let div = this.dropRef.current as HTMLElement;
    div.removeEventListener('dragenter', this.handleDragIn as (e: Event) => void)
    div.removeEventListener('dragleave', this.handleDragOut as (e: Event) => void)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop as (e: Event) => void)
  }
  render() {
    return (
      <div
        style={{ display: 'inline-block', position: 'relative' }}
        ref={this.dropRef as any}
      >
        <div
          style={{
            border: this.state.drag ? 'dashed grey 6px' : 'dashed gray 3px',
            backgroundColor: 'rgba(255,255,255,.8)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              left: 0,
              textAlign: 'center',
              color: 'grey',
              fontSize: 36
            }}
          >

          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
export default DragAndDrop