import React, { useEffect, useState } from 'react';

const PaymentStatus = () => {
  const [status, setStatus] = useState(null); // State to store the payment status
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    // Parse the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status'); // Retrieve 'status' from the query params

    setStatus(paymentStatus); // Set the payment status
    setLoading(false); // Set loading to false once done
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Payment Status</h1>
      {loading ? (
        <p>Loading...</p>
      ) : status ? (
        <p>Your payment status is: <strong>{status}</strong></p>
      ) : (
        <p>No payment status found in the URL.</p>
      )}
    </div>
  );
};

export default PaymentStatus;
