import React from "react";
import Card from "react-bootstrap/Card";

function Secretory() {
  return (
    <>
      <Card className="announcmentCard border-0">
        <Card.Body className="px-2 pt-0">
          <div className="text-center">
            <Card.Img variant="top" src="/assets/images/quote.jpg" />
          </div>
          <div className="text-center">
            <h5>"People say the effect is only on the mind, it is no such thing, The effect only on the body too"</h5>
            <h6 className="text-primary">Florence Nightingale</h6>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default Secretory;
