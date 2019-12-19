import React, { useState } from 'react';
import { Card } from 'antd';
import BraftEditor from 'braft-editor';
// @ts-ignore
import 'braft-editor/dist/index.css';

export default (props: any) => {
  const { getHtml } = props;
  const [editorState, setEditorState] = useState();

  const submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    getHtml && getHtml(editorState.toHTML());
  };

  const handleEditorChange = (editorState: any) => {
    setEditorState(editorState);
  };
  return (
    <Card>
      <BraftEditor
        id="editor-1"
        value={editorState}
        onChange={handleEditorChange}
        onSave={submitContent}
      />
    </Card>
  );
}
