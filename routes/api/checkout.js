const express = require("express");
const router = express.Router();
//const stripe = require('stripe')('sk_test_51HeAu7EMg9ur2p3yOKfgZ3Yz7vJgJoylLrV3mrr24bEfBmSap9Xr8rkepXAbKxdpo4z1mFTZ0f0HucM8WNfVKg0V00YrKxwDwQ');
const stripe = require('stripe')('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');


//const app = express();
//app.use(express.static('.'));

// Load User model
const User = require("../../models/User");

router.post("/create-session", async (req, res) => {
    console.log('arrived checkout')
    //console.log('req: ', req)
    const user_id = req.body.user_id
 
    var suc_url
    var can_url
    if (req.body.afterSignup){
      suc_url = `http://localhost:3000/account?success=true?session_id={CHECKOUT_SESSION_ID}`
      can_url = `http://localhost:3000/account?canceled=true?session_id={CHECKOUT_SESSION_ID}`
    } else {
      suc_url = `http://localhost:3000/promptGoPremium?success=true?user_id=`+user_id+`?session_id={CHECKOUT_SESSION_ID}`
      can_url = `http://localhost:3000/promptGoPremium?canceled=true?session_id={CHECKOUT_SESSION_ID}`
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Premium Tire: One-Time Payment`,
                //type: 'service',
                //images: ['https://i.imgur.com/EHyR2nP.png'],
                images: ['https://i.imgur.com/D3dVJRe.png'],
              },
              unit_amount: 500,
            },
            quantity: 1,
          }, 
        ],
        mode: 'payment',
        //success_url: `http://localhost:3000/promptGoPremium?success=true`,
        //cancel_url: `http://localhost:3000/dashboard?canceled=true`,
        success_url: suc_url,
        cancel_url: can_url
    });

      //console.log('session: ', session)

      res.json({ id: session.id });
});

router.post("/check-session", async (req, res) => {
  console.log('req.body.session_id: ', req.body.session_id)
  const session = await stripe.checkout.sessions.retrieve(
    req.body.session_id
  );

  console.log('session: ', session.payment_status)

  if (session.payment_status === 'paid'){
    let user = await User.findOne({_id: req.body.user_id})
    if (user) {
      console.log('found user')
      await user.updateOne({paid: true})
      res.json({payment_status: session.payment_status})
    }
  }

  
});

module.exports = router;

