import './App.css';

import CryptoJS, { MD5 } from 'crypto-js';
import React, { useState } from 'react';

function App() {
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskFile, setTaskFile] = useState<File[]>([]);

  const handleGetAccessToken = async () => {
    // 对字符串 ”app_id+下划线+时间戳” 以 app_secret（DeepCare 发放）作为盐进行3次散列加密得到密钥签名
    const timestamp = Date.now().toString();
    const msg = appSecret + `${appId}_${timestamp}`;
    let wordArray = MD5(msg);
    for (let i = 1; i < 3; i++) {
      wordArray = MD5(wordArray);
    }
    const sign = wordArray.toString(CryptoJS.enc.Hex);
    // Body
    const body: Record<string, string> = {
      app_id: appId,
      timestamp,
      sign,
    };
    console.log('body', body);
    const res = await fetch(`/api-auth/getAccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
    console.log('res', res);
    const accessToken = res.access_token;
    setAccessToken(accessToken);
  };

  const handleUploadCbct = async () => {
    const uuid = crypto.randomUUID().replaceAll('-', '');
    setTaskId(uuid);
    console.log('uuid', uuid);
    const formData = new FormData();
    formData.append('task_id', uuid);
    taskFile.forEach((file) => {
      formData.append('task_file', file);
    });
    formData.append('file_lifespan', '259200');
    const res = await fetch('/api-service/uploadCBCT', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    console.log('res', res);
  };

  return (
    <div className="App">
      <h1>DeepCare CBCT API TEST</h1>
      <h2>Get Access Token</h2>
      <div>
        <label htmlFor="app_id">app_id:</label>
        <input
          type="text"
          id="app_id"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="app_secret">app_secret:</label>
        <input
          type="text"
          id="app_secret"
          value={appSecret}
          onChange={(e) => setAppSecret(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleGetAccessToken}>Generate</button>
      </div>
      <div>
        <label htmlFor="access_token">access_token:</label>
        <input type="text" id="access_token" value={accessToken} readOnly />
      </div>
      <hr />
      <h2>Upload CBCT</h2>
      <div>
        <label htmlFor="task_id">task_id:</label>
        <input
          type="text"
          id="task_id"
          value={taskId}
          onChange={(e) => setAppId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="task_file">task_file:</label>
        <input
          type="file"
          id="task_file"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setTaskFile(Array.from(files));
            }
          }}
          multiple
        />
        <div>
          <button onClick={handleUploadCbct}>Upload</button>
        </div>
      </div>
    </div>
  );
}

export default App;
