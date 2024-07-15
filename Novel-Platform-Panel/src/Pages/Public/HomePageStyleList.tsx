import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import { GetAllStyleMessage } from 'Plugins/StyleAPI/GetAllStyleMessage'
import { DeleteStyleMessage } from 'Plugins/StyleAPI/DeleteStyleMessage'

const HomePageStylesList = () => {
    const history = useHistory()
    const [styles, setStyles] = useState([])
    const getCurrentStyleId = () => {
        try {
            const storedStyleId = localStorage.getItem('currentStyleId')
            return storedStyleId ? parseInt(storedStyleId) : 1 // Default to 1 if not found
        } catch (e) {
            console.error('Error fetching current style ID:', e)
            return 1 // Default to 1 in case of any error
        }
    }
    const [currentStyleId, setCurrentStyleId] = useState(getCurrentStyleId())

    useEffect(() => {
        fetchStyles()
    }, [])

    useEffect(() => {
        setCurrentStyleId(getCurrentStyleId())
    }, [styles])

    const fetchStyles = async () => {
        try {
            const response = await axios.post(
                new GetAllStyleMessage().getURL(),
                JSON.stringify(new GetAllStyleMessage()),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            setStyles(response.data)
        } catch (err) {
            console.error('Failed to get styles', err)
        }
    }

    const deleteStyle = async (id: number) => {
        try {
            const response = await axios.post(
                new DeleteStyleMessage(id).getURL(),
                JSON.stringify(new DeleteStyleMessage(id)),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            )
            fetchStyles() // Refresh styles after deletion
        } catch (err) {
            console.error('Failed to delete style', err)
        }
    }

    const goToEdit = (id: number) => {
        history.push(`/edithomepage?id=${id}`)
    }

    const handleApplyStyle = (styleId: number) => {
        setCurrentStyleId(styleId)
        localStorage.setItem('currentStyleId', styleId.toString())
    }


    return (
        <div>
            <h2>Styles List</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Style Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {styles.map((style) => (
                    <tr key={style.id}>
                        <td>{style.id}</td>
                        <td>{style.stylename}</td>
                        <td>
                            <button onClick={() => goToEdit(style.id)}>Edit</button>
                            {style.id !== 1 && style.id !== currentStyleId && (
                                <button onClick={() => deleteStyle(style.id)}>Delete</button>
                            )}
                            {style.id !== currentStyleId && (
                                <button onClick={() => handleApplyStyle(style.id)}>Apply</button>
                            )}
                            {style.id === currentStyleId && <span>Applied</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => history.push('/editormain')}>Go Back</button>
        </div>
    )
}

export default HomePageStylesList

