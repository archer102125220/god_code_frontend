import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class RichTextEditor extends React.Component {
  static propTypes = {
    readonly: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    readonly: false,
    onChange: () => { },
  }

  state = {
    editorState: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, readonly } = nextProps;
    const { editorState } = prevState;
    if (_.isUndefined(value)) {
      return null;
    }
    if (_.isNull(editorState)) {
      return {
        editorState: BraftEditor.createEditorState(value),
      }
    }
    const content = editorState.toHTML();
    if (readonly || value !== content) { // prevent cycle setState (BraftEditor issue#238)
      return {
        editorState: BraftEditor.createEditorState(value),
      }
    }
    return null;
  }

  handleEditorChange = (editorState) => {
    const { value, readonly } = this.props;
    const content = editorState.toHTML();
    if (!readonly && (!_.isUndefined(value) || content !== '<p></p>')) { // prevent cycle setState (BraftEditor issue#238)
      this.setState({
        editorState,
      });
      _.invoke(this.props, 'onChange', content);
    }
  }

  render() {
    const { readonly } = this.props;
    const { editorState } = this.state;
    const props = _.omit(this.props, ['onChange', 'readonly', 'value']);
    const controls = (readonly) ? [] : BraftEditor.defaultProps.controls.map(item => {
      return item === 'media' ? {} : item
    });
    return (
      <div style={{ border: '1px solid #ccc' }}>
        <BraftEditor onChange={this.handleEditorChange} language="zh-hant" controls={controls} draftProps={{ readOnly: readonly }} value={editorState} {...props} />
      </div>
    );
  }
}

export default RichTextEditor;
