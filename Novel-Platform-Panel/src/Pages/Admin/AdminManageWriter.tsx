import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { AdminWriterInfoMessage } from 'Plugins/WriterAPI/AdminWriterInfoMessage';
import { WriterDeleteWriterMessage } from 'Plugins/WriterAPI/WriterDeleteWriterMessage'



const AdminManageWriter: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');
    const history = useHistory();
    const [writers, setWriters] = useState<[]>([]);

    useEffect(() => {
        fetchWriters();
    }, []);

    const fetchWriters = async () => {
        try {
            const response = await axios.post((new AdminWriterInfoMessage()).getURL(), JSON.stringify(new AdminWriterInfoMessage()), {
                headers: { 'Content-Type': 'application/json' },
            });
            setWriters(response.data);
        } catch (error) {
            console.error('Error fetching writers:', error);
        }
    };

    const navigateToWriterProfile = (writerName: string) => {
        const encodedWriterName = encodeURIComponent(writerName);
        history.push(`/adminwriterprofile?username=${username}&writername=${encodedWriterName}`);
    };

    const deleteWriter = async (writerName: string) => {
        try {
            const response = await axios.post((new WriterDeleteWriterMessage(writerName)).getURL(), JSON.stringify(new WriterDeleteWriterMessage(writerName)), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data);  // 输出成功删除的消息或其他反馈
            // 刷新作者列表或执行其他操作
            await fetchWriters();  // 或者根据情况更新状态
        } catch (error) {
            console.error('Error deleting writer:', error);
            // 处理错误，显示适当的错误消息给用户
        }
    };

    return (
        <div>
            <header>
                <h1>Manage Writers</h1>
            </header>
            <table style={{ width: '60%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '20px' }}>
                <thead>
                <tr>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Writer Name</th>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {writers.map((writer, index) => (
                    <tr key={index}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{writer["writeruser"]}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{writer["writeremail"]}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                            <button onClick={() => navigateToWriterProfile(writer["writeruser"])}>View Profile</button>
                            <button onClick={() => deleteWriter(writer["writeruser"])}>Delete</button>  {/* 添加删除按钮 */}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => history.push(`/adminmain/?userName=${username}`)} style={{ padding: '10px 20px', marginTop: '20px' }}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default AdminManageWriter;
