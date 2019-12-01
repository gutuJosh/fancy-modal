(function(){
         
    // Define our constructor 
    this.FancyModal = function() {

     // Create global element references
     this.closeButton = null;
     this.continueButton = null;
     this.cancelButton = null;
     this.image = null;
     this.modal = null;
     this.overlay = null;

     // Define defaults option
     var defaults = {
       modalType:'info',
       className: 'fade-and-slide-down',
       content: "",
       title:false,
       message:false,
       maxWidth: 600,
       minWidth: 300,
       overlay: 'dark',
       buttonAction: false,
       okBtnTxt: 'Continue',
       koBtnTxt: 'Cancel'
     };
    

     // Extend defaults with the passed in arugments
     if(arguments[0] && typeof arguments[0] === "object") {
         let object = arguments[0];
         for(property in object){
           if(object.hasOwnProperty(property)){
             defaults[property] = object[property];
           };
         };
     };

     this.options = defaults;
    
    };

    // Private Methods

    function buildModal(){
       var header, content, contentBody, footer, docFrag;

       /*
      * If content is an HTML string, append the HTML string.
      * If content is a domNode, append its content.
      */
       content = (typeof this.options.content === 'string') ? this.options.content : this.options.content.innerHTML;

       // Create a DocumentFragment to build with
       docFrag = document.createDocumentFragment();

       // Create modal element
       this.modal = document.createElement('div');
       this.modal.className = `fancy-modal ${this.options.modalType} ${this.options.className} ${this.options.overlay}`;
       this.modal.style.maxWidth = `${this.options.maxWidth}px`;
       this.modal.style.minWidth = `${this.options.minWidth}px`;

       // Create content area
       contentBody = document.createElement('div');
       contentBody.className = 'fancy-modal-body';

       // Add a close button
       this.closeButton = document.createElement('button');
       this.closeButton.className = 'fancy-modal-close-btn';
      
      //Image modal
      if(this.options.modalType === 'image'){
          this.image = new Image();
          this.image.src = this.options.imageSrc;
          contentBody.appendChild(this.image);
          contentBody.appendChild(this.closeButton);
      }
      else{
       //Create modal header
       header = document.createElement('header');
       header.className = 'fancy-modal-header';

       //Append close button
       header.appendChild(this.closeButton);
       
       //Add content
       contentBody.innerHTML = content === '' ? 
       `<p class="fancy-modal-title">${this.options.title}</p>
        <p class="fancy-modal-message">${this.options.message}</p>`
       :
       content;

       //Create footer
       footer = document.createElement('footer');
       footer.className = 'fancy-modal-footer'; 

       //Create continue button and append to footer
       this.continueButton = document.createElement('button');
       this.continueButton.className = 'fancy-modal-ok-btn';
       this.continueButton.innerHTML = this.options.okBtnTxt;
       footer.appendChild(this.continueButton);

       //Create cancell button and append to footer
       if(typeof this.options.buttonAction === 'function'){
          this.cancelButton = document.createElement('button');
          this.cancelButton.className = 'fancy-modal-ko-btn';
          this.cancelButton.innerHTML = this.options.koBtnTxt;
          footer.appendChild(this.cancelButton);
       }

      }

       //Create overlay
       this.overlay = document.createElement('div');
       this.overlay.className = `fancy-modal-overlay-mask ${this.options.overlay}`;

       //Mount Modal with css 3d effects
       if(this.options.className.includes('flip-card')){
          var frontCard, backCard, cardWrapper;
          //create front-card and back-card wrapper
          cardWrapper = document.createElement('div');
          cardWrapper.className = 'cards-wrapper';
          //front-card
          frontCard = document.createElement('div');
          frontCard.className = 'front-card';
          //back-card
          backCard = document.createElement('div');
          backCard.className = 'back-card';
          //Image modal
          if(this.options.modalType === 'image'){
            //Add content to modal 
            frontCard.appendChild(contentBody);
          }
          else{
           //Append  header, content, footer, to front-card
           frontCard.appendChild(header);
           frontCard.appendChild(contentBody);
           frontCard.appendChild(footer);
          }
          cardWrapper.appendChild(frontCard);
          cardWrapper.appendChild(backCard);
          //Append all to modal
          this.modal.appendChild(cardWrapper);
       }
       //Mount header content and footer
       else {
        //Image modal
        if(this.options.modalType === 'image'){
          this.modal.appendChild(contentBody);
          this.modal.appendChild(this.closeButton);
        }
        else{
          //Append header to modal
          this.modal.appendChild(header);
          
          //Add content to modal 
          this.modal.appendChild(contentBody);

          //Append footer to modal
          this.modal.appendChild(footer);
        }
      }

     //Append modal to overlay
     this.overlay.appendChild(this.modal);

     //Append overlay to DocumentFragment
     docFrag.appendChild(this.overlay);

     // Append DocumentFragment to body
     document.body.appendChild(docFrag);


    };


    function initializeEvents(){
       
       const self = this;
       this.closeButton.addEventListener('click', this.close.bind(this), false);
       try{
        if(typeof this.options.buttonAction === 'function'){
            
            this.continueButton.addEventListener('click', () => {
              self.close();
              self.options.buttonAction();
            }, false);
            this.cancelButton.addEventListener('click', this.close.bind(this), false);
        }
        else{
              this.continueButton.addEventListener('click', this.close.bind(this), false);
        }
      }
      catch(error){
          console.log(error);
      }
      //Show mask and modal
      this.overlay.classList.add('mask-on');
      this.overlay.addEventListener('click', (event) => {
        if(event.target.classList.contains('mask-on')){
          self.close();
        }
      }, false);
      setTimeout(function(){
        self.modal.classList.add('show');
      }, 10);
      
    }

    // Public Methods

    FancyModal.prototype.open = function(){
        // Build out our Modal
         buildModal.call(this);
         initializeEvents.call(this);

         //Adjust back-card height
         if(this.modal.classList.contains('flip-card')){
            let modalHeight = document.querySelector('.cards-wrapper .front-card').offsetHeight;
            document.querySelector('.cards-wrapper .back-card').style.height = modalHeight + 'px';
         }

         //Adjust modal width and height  for small screen 
         try{
           if(window.innerWidth <= 320){
              this.modal.style.minWidth = (window.innerWidth - 40) + 'px';
           }
           if(window.innerHeight <=  this.modal.offsetHeight){
               this.modal.style.height = (window.innerHeight - 20) + 'px';
               this.modal.style.overflow = 'auto';
           }
         }
         catch(error){
           console.log(error);
         }
    }

    FancyModal.prototype.close = function(){
         const self = this;
         this.modal.classList.remove('show');
         this.modal.addEventListener('transitionend', function(){
              self.modal.remove();
         }, false);

         this.overlay.classList.remove('mask-on');
         this.overlay.addEventListener('transitionend', function(){
                self.overlay.remove(); 
         }, false);
         
    }


 }());
