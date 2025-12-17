import dbConnect from "@/lib/mongoose";
import Idea from "@/models/Idea";
import { NextResponse } from "next/server";
import { updateIdeaVoteSchema } from "@/lib/validation";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, change } = updateIdeaVoteSchema.parse(body);
    await dbConnect();

    // decide increment field dynamically
    const fieldToUpdate = change === "plus" ? "likes" : "dislikes";

    // single efficient update
    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      { $inc: { [fieldToUpdate]: 1 } }, // MongoDB increment operator
      { new: true } // return updated doc
    );

    if (!updatedIdea) {
      return NextResponse.json({
        success: false,
        message: "Idea not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        likes: updatedIdea.likes,
        dislikes: updatedIdea.dislikes,
      },
      message: `Updated ${fieldToUpdate} count successfully`,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
        return NextResponse.json({
            success: false,
            message: error.issues.map((issue) => issue.message).join(', ')
        }, {
            status: 400
        })
    }
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Count can't be updated",
    });
  }
}



// import dbConnect from "@/lib/mongoose";
// import Idea from "@/models/Idea";
// import { NextResponse } from "next/server";


// export async function POST(req,res) {


//     try {
//         const {id,change} = await req.json()
//         await dbConnect()
         
//         const idea = await Idea.findById(id)
//       if(change === 'plus'){
//         idea.likes = idea.likes + 1;
//         console.log(idea.likes);
        
//       }else{
//          idea.dislikes = idea.dislikes + 1;
//          console.log(idea.dislikes)
//       }
      
//       const changeCount =  await Idea.findByIdAndUpdate(id,{likes:idea.likes, dislikes:idea.dislikes,}, {new: true})
         

//         return NextResponse.json({
//             success:true,
//             data:{likes:changeCount.likes, dislikes:changeCount.dislikes},
//             message:"Updated Count-likes/dislikes"
//         })
        
//     } catch (error) {
//         console.log(error);
        
//         return NextResponse.json({
//                     success:false,
//                     message:"Count cant be updated"
//                 })
        
//     }
    
// }