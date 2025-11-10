import React, { useState } from "react";

const CancelOrderModel = ({ show, handleClose, orderNumber, paymentMode }) => {
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlesubmit = async () => {
    if (!remark.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cancle_order/${orderNumber}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            remark,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        let msg = result.message;
        if(paymentMode === 'online'){
          msg += '\n Since you paid online,your amount willl be refunded to your account within 2 days'
        }
        setMessage(msg);
        setRemark('');
        setError('');

      }
       else {
        setError (result.message || 'failed to cancel order')
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };
  return (
    <div className={`modal fade ${show ? 'show d-block' : '' }`} tabindex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Order #{orderNumber}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div class="modal-body">
            {message ? (
              <div className="alert alert-success">{message}</div>
            ) : (
              <>
              <label className="form-label">Reason for cancellation</label>
              <textarea className="form-control" rows="4" value={remark}
              onChange = {(e) => setRemark(e.target.value)}
              placeholder="Enter reason here.....">
                  </textarea>
                {error && <div className="text-danger mt-2">{error}</div>}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              onClick={handleClose}

            >
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={handlesubmit}>
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModel;
