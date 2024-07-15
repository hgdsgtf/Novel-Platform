import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { AdminAuditorInfoMessage } from 'Plugins/AuditorAPI/AdminAuditorInfoMessage';
import { AuditorGetQualifiedMessage } from 'Plugins/AuditorAPI/AuditorGetQualifiedMessage'



const AdminManageAuditor: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const username = query.get('userName');
    const history = useHistory();
    const [auditors, setAuditors] = useState<[]>([]);

    useEffect(() => {
        fetchAuditors();
    }, []);

    const fetchAuditors = async () => {
        try {
            const response = await axios.post((new AdminAuditorInfoMessage()).getURL(), JSON.stringify(new AdminAuditorInfoMessage()), {
                headers: { 'Content-Type': 'application/json' },
            });
            setAuditors(response.data);
        } catch (error) {
            console.error('Error fetching auditors:', error);
        }
    };

    const qualifyAuditor = async (auditorName: string) => {
        try {
            const response = await axios.post((new AuditorGetQualifiedMessage(auditorName)).getURL(), JSON.stringify(new AuditorGetQualifiedMessage(auditorName)), {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data);
            await fetchAuditors();
        } catch (error) {
            console.error('Error qualifying auditor:', error);
       }
    };


    return (
        <div>
            <header>
                <h1>Manage Auditors</h1>
            </header>
            <table style={{ width: '60%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '20px' }}>
                <thead>
                <tr>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Auditor Name</th>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {auditors.map((auditor, index) => (
                    <tr key={index}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{auditor['auditoruser']}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{auditor['auditoremail']}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{auditor['auditorstatus'] ? 'qualified' : 'unqualified'}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>

                            <button onClick={() => qualifyAuditor(auditor['auditoruser'])}>{auditor['auditorstatus'] ? 'Disqualify' : 'Qualify'}</button>
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

export default AdminManageAuditor;