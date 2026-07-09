import 'dotenv/config'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI

async function main(){
  console.log('Testing MongoDB connection...')
  try{
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    console.log('✅ MongoDB connected successfully')
    await mongoose.disconnect()
    process.exit(0)
  }catch(err){
    console.error('❌ MongoDB connection failed:')
    console.error(err && err.message ? err.message : err)
    if (err && err.name) console.error('Error name:', err.name)
    if (err && err.reason) console.error('Reason:', err.reason)
    process.exit(1)
  }
}

main()
