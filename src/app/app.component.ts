import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Post } from './post.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.fetchPosts();
  }

  onCreatePost(postData: {title: string, content: string}){
    this.http
    .post< {name: string} >(
        'https://ng-complete-guide-68ffd-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData)
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.isFetching = true;
    this.http.get<{ [key:string]: Post } >('https://ng-complete-guide-68ffd-default-rtdb.firebaseio.com/posts.json')
      .pipe(
        map(responseData => {
        const postsArray = [];
        for(const key in responseData){
            if(responseData.hasOwnProperty(key)){
            //postsArray.push({ ...JSON.parse(JSON.stringify(responseData))[key], id: key})
            postsArray.push({ ...responseData[key], id: key})
          }
        }
        return postsArray;
      })
      )
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      });
  }
}
