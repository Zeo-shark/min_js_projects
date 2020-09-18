const express=require('express');
const Subscriber= require('../models/subscribers')
const router=express.Router();

//Getting all
router.get('/',async (req,res)=>{
    try{
        const subscribers= await Subscriber.find()
        res.json(subscribers)
    } catch {
        res.status(500).json({message:err.message})

    }
})
//Getting one
router.get('/:id',getSubscriber,(req,res)=>{
    res.send(req.subscriber.name)
})
//Creating one
router.post('/',async(req,res)=>{
    const subscriber= new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel,
    })
try{
    const newSubscriber= await subscriber.save()
    res.status(201).json(newSubscriber)
} catch(err){
    res.status(400).json({message:err.message})
}
})
//Updating one
router.patch('/:id',getSubscriber,async (req,res)=>{
    if(req.body.name!=null){
        res.subscriber.name= req.body.name
    }
    if( req.body.subscribedToChannel!=null){
        res.subscriber.subscribedToChannel= req.body.subscribedToChannel
    }
    try{
        const updatedSubscriber= await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch(err){
        res.status(400).json({message:err.message})//users issue
    }
})
//Delete one
router.delete('/:id',getSubscriber,async (req,res)=>{
    try{
        await res.subscriber.remove()
        res.json({message:'successfully deleted subscriber'})
    } catch(err){
        res.status(500).json({message: err.message})
    }
})
async function getSubscriber(req,res,next){
    let subscriber
    try{
        subscriber= await Subscriber.findViewById(req.params.id)
        if(subscriber==null){
            return res.status(404).json({message:'Cannot find subsciber'})
        }
    } catch(err){
        return res.status(500).json({message:err.message})
    }
    res.subscriber= subscriber
    next()
}


module.exports= router;