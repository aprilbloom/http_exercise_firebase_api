import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from 'src/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  loadedPosts: Post[] = [];
  isFetching = false;
  error =  null || '';
  private errorSub! : Subscription;

  constructor(private http: HttpClient, private postService: PostsService){}

  ngOnInit(){
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.postService.fetchPosts()
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
    });
  }

  onCreatePost(postData: {title: string, content: string}){
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
    }, error => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error);
    });
  }

  onClearPosts() {
   this.postService.clearPosts()
     .subscribe(() => {
      this.loadedPosts = [];
     });
  }

  ngOnDestroy() {
      this.errorSub.unsubscribe();
  }

}
