const User_role = require('../../models/user_role.model')
const { validationResult } = require('express-validator');
module.exports = {
    "index": async (req , res ) =>{
        const result = await User_role.find();
       return res.render('admin/userRole/list',{result : JSON.parse(JSON.stringify(result)),title:'Add User Role',page_title_1:'User Role',page_title_2:'User',layout:'dashboard_layout', isUserRole: true})
    },
    "userRole_create": async(req,res) =>{
       return res.render('admin/userRole/add',{title:'Add User Role',page_title_1:'User Role Add',page_title_2:'User',layout:'dashboard_layout', isUserRole: true})
    },
    "userRole_add" : async(req , res)=>{
        const error = validationResult(req)
        if(error.errors.length > 0){
            req.flash("form1",[{'user_Role':req.body.user_Role}])
            req.flash('user_Role_error',error.errors)
            return res.redirect('/admin/user-role/add');
        }
        try {
            const isdata =await User_role.find().count();
            if(isdata)
                var result = await User_role.find({}).sort({serial_no: -1}).limit(1);
            const user_role = new  User_role({
                serial_no : isdata ? result[0].serial_no+1 : 1,
                user_role_name : req.body.user_Role,
                status : true
            })
            console.log("data : ",user_role);
            await user_role.save();
            return res.redirect("/admin/user-role");
        } catch (error) {
            console.log("error : ",error)
            return res.send(error);
        }
    },
    "status_change" : async (req,res) =>{
        const id = req.params.id;
        try {
            const data = await User_role.findOne({_id : id});
            data.status = !data.status;
            await data.save();
            return res.redirect('/admin/user-role');
        } catch (error) {
            console.log("error : ",error)
            return res.send(error);
        }
    },
    "delete" : async (req,res) =>{
        try {
            await User_role.deleteOne({ _id : req.body.property_id })
        } catch (error) {
            console.log("error : ",error)
            return res.send(error);
        }

    res.redirect('/admin/user-role')
    },

    "edit_create" : async(req,res) =>{
        console.log('isedit : ',req.query.isedit)
        const id = req.params.id;
        if(req.query.isedit=='true'){
            var data = await User_role.find({_id : id}); 
           res.render('admin/userRole/edit',{data:JSON.parse(JSON.stringify(data)),title:'Add User Role',page_title_1:'User Role',page_title_2:'User',layout:'dashboard_layout', isUserRole: true})
        }
        else{
            res.render('admin/userRole/edit',{data:JSON.parse(JSON.stringify([{_id:id}])),title:'Add User Role',page_title_1:'User Role',page_title_2:'User',layout:'dashboard_layout', isUserRole: true})
         }
    },
    "update": async( req, res) => {
        const error = validationResult(req)
        if(error.errors.length > 0){
            req.flash("form1",[{'user_role_name':req.body.Property_type}])
            req.flash('user_role_error',error.errors)
            return res.redirect('/admin/user-role/edit/'+req.params.id+"?isedit=false");
        }
        try {
            const id = req.params.id
            const data = await User_role.findOne({_id : id}); 
            data.user_role_name = req.body.user_role_name;
            await data.save();
            req.flash('Update sucessfull');
            return res.redirect('/admin/user-role');
        } catch (error) {
            console.log("error : ",error)
            return res.send(error);
        }
    }
}