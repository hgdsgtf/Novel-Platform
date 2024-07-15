import React, { useState } from 'react'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { ReaderAddMoneyMessage } from 'Plugins/ReaderAPI/ReaderAddMoneyMessage'

const ReaderAddMoney = () => {
    const history = useHistory()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const username = query.get('userName')
    const [balance, setBalance] = useState(0)
    const [, setError] = useState('')
    const [, setSuccess] = useState('')
    const money = query.get('money')

    const handleRecharge = async () => {
        try {
            const response = await axios.post(
                new ReaderAddMoneyMessage(username, balance).getURL(),
                JSON.stringify(new ReaderAddMoneyMessage(username, balance)),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setSuccess(response.data)
            setTimeout(() => {
                history.push(`/readermain?userName=${username}`)
            }, 1000)
        } catch (err) {
            console.error('Failed to fetch chapters', err)
            const rExp: RegExp = /(?<=Body:).*/
            setError(err.response.data.error.match(rExp))
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const parsedValue = parseInt(value)
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setBalance(parsedValue)
        } else {
            setBalance(0)
        }
    }

    return (
        <div>
            <h2>Read Novel</h2>
            <div>
                <h2>Recharge Account</h2>
                <p>Current Balance: ${money}</p>
                <input
                    type="number"
                    placeholder="Enter amount to recharge"
                    value={balance}
                    onChange={e => {
                        handleChange(e)
                        setError('')
                    }}
                />
                <button onClick={handleRecharge}>Recharge</button>
            </div>

            <button
                onClick={() => history.push(`/readermain?userName=${username}`)}
                style={{ padding: '10px 20px', marginTop: '20px' }}
            >
                Go Back
            </button>
        </div>
    )
}
export default ReaderAddMoney
