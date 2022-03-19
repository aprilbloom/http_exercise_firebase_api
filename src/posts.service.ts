import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./app/post.model";
import { map } from "rxjs";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService{
  error = new Subject<string>();

  constructor(private http: HttpClient){}
  createAndStorePost(title1: string, content1: string){
    const postData: Post = { title: title1, content: content1}
    this.http
    .post< {name: string} >(
        'https://ng-complete-guide-68ffd-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData)
      },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts(){
    return this.http.get<{ [key:string]: Post } >('https://ng-complete-guide-68ffd-default-rtdb.firebaseio.com/posts.json')
      .pipe(
        map(responseData => {
        const postsArray: Post[] = [];
        for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
            //postsArray.push({ ...JSON.parse(JSON.stringify(responseData))[key], id: key})
            postsArray.push({ ...responseData[key], id: key})
          }
        }
        return postsArray;
      })
      );
  }

  clearPosts(){
    return this.http.delete('https://ng-complete-guide-68ffd-default-rtdb.firebaseio.com/posts.json');
  }
}





//Implement either:
//adding subject and used next - if multiple component would need the response
//return the result of get method and subscribe at component
