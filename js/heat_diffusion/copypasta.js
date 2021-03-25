var rows = 20;
var cols = 20;
var source =0;
var destination =0;
var grid = new Array(cols);

function setup() {
     createCanvas(400, 400);
     for(var i=0;i<cols ; i++){
      grid[i] = new Array(rows);
     }
     for(var j=0;j<cols;j++){
       for(var k=0;k<rows;k++){
         grid[j][k] = new node();
        }
     }
   }

function draw()
   {
    for(var j=0;j<cols;j++)
     {
       for(var k=0;k<rows;k++)
       {
      grid[j][k].display(j*20,k*20);

        }
      }
   }

function mouseClicked()
 {
   for(var j=0;j<cols;j++)
   {
      for(var k=0;k<rows;k++)
      {

     if((mouseX > (j)*20 && mouseX< (j+1) *20 )&& (mouseY > (k)*20 && mouseY< (k+1) *20 ))
       {
      grid[j][k].clicked();
       }

       }
     }
     }
 class node{
   constructor(){
     this.value =255 ;
   }

   display(x,y){
        rect(x,y,20,20);
        fill(this.value);
                   }
  clicked() {
      if(source == 1 ){
      this.value = color(242, 39, 39);
       source = 0;
      }
      else if(destination ==1){
      this.value =color(254,200 ,150);
      destination = 0;
       }
     else{if (this.value === 0) {
     this.value = 255;
      } else {
      this.value = 0;
      }  }}}
      function sourceee(){
            if (source=== 0) {
                       source = 1;
                     } else {
                        source = 0;
                            }
                          }
             function destinations(){
                       if (destination=== 0) {
                                   destination = 1;
                                          } else {
                                    destination = 0;
                                    }
                                    }
