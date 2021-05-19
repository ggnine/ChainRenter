import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import client from '../../../feathers';

// const uploadService = client.service('uploads');

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        console.log("existing image",props.existingImage);
        console.log("true exist image:",props.imageAlready);
        // if (props.imageAlready) {
            this.state = {
                file: '',
                imagePreviewUrl: '',
                // clearFile: false
            };
        // } else {
        //     this.state = {
        //         file: '',
        //         imagePreviewUrl: '',
        //         imageAlready:false

        //     };
        // }
    }
    

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        let zee = e;
        reader.onloadend = () => {
            console.log('encoded file: ', reader.result);

            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            
            this.props.uploadIt(file, reader.result).then((res) => {
                console.log("promissie", res);
                document.getElementById('inp').value=null;
                // zee.target.value = null;
                // that.setState({
                //     file: '',
                //     imagePreviewUrl: ''
                // });
            });

            // //goes in in parent component
            // var upload = uploadService
            //     .create({ uri: reader.result })
            //     .then(function (response) {
            //         // success
            //         alert('UPLOADED!! ');
            //         console.log('Server responded with: ', response);
            //     });
        }
        let that = this;
        reader.readAsDataURL(file);
    }

    //old way of uploading----
    // _handleImageChange(e) {
    //     e.preventDefault();

    //     let reader = new FileReader();
    //     let file = e.target.files[0];

    //     reader.onloadend = () => {
    //         this.setState({
    //             file: file,
    //             imagePreviewUrl: reader.result
    //         });
    //     }
    //     let that = this;
    //     reader.readAsDataURL(file);
    //     this.props.uploadIt(file).then((res)=>{
    //         console.log("promissie",res);
    //         that.setState({
    //             file: '',
    //             imagePreviewUrl: ''
    //         });
    //     });
    // }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        console.log("imagr prev url:",imagePreviewUrl);
        console.log("true or falase img ready,",(imagePreviewUrl && this.props.showImage));
      
        if (imagePreviewUrl && this.props.showImage) {
            $imagePreview = (<Image src={imagePreviewUrl} fluid />);
        } else if (this.props.imageAlready && this.props.existingImage){
            $imagePreview = (<Image src={this.props.existingImage} fluid />);
        }else {
            $imagePreview = (<p></p>);
        }

        // if (this.props.clearFile){
          
        //         try{
        //             e.target.files[0];

        //         } catch(err){
        
        //             console.log("error nulling file upload",err);
        //         }
        // }

        return (

            <div>
                <label className="custom-file-upload fileInput">
                    <input type="file" id="inp" ref="inpref" onChange={(e) => this._handleImageChange(e)} />
                    Select Image
                        </label>
                <p></p>
                {/* <Button variant="secondary" className="submitButton"
                        type="submit"onClick={(e) => this._handleSubmit(e)}>Upload Image
                        </Button> */}


                <div className="imgPreview justify-content-md-center" >
                    {$imagePreview}
                </div>
            </div>
        )
    }
}

export default ImageUpload;