import threadspy
import os
 
USERNAME = os.environ.get("USERNAME")
PASSWORD = os.environ.get("PASSWORD")
 
 
threads_api = threadspy.ThreadsApi("", "")
login_status = threads_api.login()
 
if login_status:
    user_id = threads_api.get_user_id('gustavopetrourrego')    # Get the user id of zuck
   
    zuck = threads_api.get_user_profile(user_id) # Get the user profile of zuck
       
    zuck_threads = zuck.get_user_threads()       # Get the threads of zuck
 
    print("\n\n",zuck_threads[0])
   
    # Obtener el ID de la publicación
    print("\n\n El ID de la publicación es ", zuck_threads[0].thread_items[0].post.id)
 
 
    for i in range(0,3):
        caption_text = zuck_threads[i].thread_items[0].post.caption.text
        print(f"Texto de la publicación #{i}: {caption_text}\n")
 
 
 
else:
    print("Login failed")