"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
interface Comment {
  id: string;
  content: string;
  user_email: string;
  user_id: string;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
  replies?: Comment[];
}

export default function CommentSection({
  product_number,
}: {
  product_number: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("product_id", product_number)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    // Organize into threads
    const commentMap: { [key: string]: Comment } = {};
    const rootComments: Comment[] = [];

    data.forEach((comment: any) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    data.forEach((comment: any) => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        commentMap[comment.parent_id].replies?.push(commentMap[comment.id]);
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    setComments(rootComments);
  }, [product_number]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleUploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `comments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("comment-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("comment-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    parentId: string | null = null,
  ) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await handleUploadImage(imageFile);
      }

      const { error } = await supabase.from("comments").insert({
        product_id: product_number,
        user_id: user.id,
        user_email: user.email,
        content: newComment,
        image_url: imageUrl,
        parent_id: parentId,
      });

      if (error) throw error;

      setNewComment("");
      setImageFile(null);
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <div
      className={`py-4 ${isReply ? "ml-8 border-l pl-4 border-gray-100" : "border-b"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-sm text-gray-800">
          {comment.user_email}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
        {comment.content}
      </p>

      {comment.image_url && (
        <div className="relative w-48 h-32 mb-3 rounded-lg overflow-hidden border">
          <Image
            src={comment.image_url}
            alt="Comment image"
            fill
            unoptimized
            loading="eager"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex gap-4 items-center">
        {user && !isReply && (
          <button
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            {replyingTo === comment.id ? "취소" : "답글 달기"}
          </button>
        )}
      </div>

      {replyingTo === comment.id && (
        <form
          onSubmit={(e) => handleSubmit(e, comment.id)}
          className="mt-4 bg-gray-50 p-3 rounded-lg"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="답글을 남겨보세요..."
            className="w-full border rounded p-2 text-sm focus:outline-blue-500 mb-2"
            rows={2}
          />
          <div className="flex justify-between items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              답글 등록
            </button>
          </div>
        </form>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6">댓글 {comments.length}</h3>

      {user ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="mb-8 border p-4 rounded-xl shadow-sm"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="상품에 대한 의견을 남겨주세요..."
            className="w-full border-none focus:ring-0 p-0 text-gray-700 mb-4 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-gray-500 hover:text-blue-600 flex items-center gap-1">
                <span className="text-xs">📷 이미지 첨부</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-xs text-blue-500 font-medium">
                  {imageFile.name}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl text-center mb-8 border border-dashed">
          <p className="text-gray-500 text-sm mb-2">
            로그인 후 댓글을 남기실 수 있습니다.
          </p>
          <Link
            href="/login"
            className="text-blue-600 font-bold hover:underline"
          >
            로그인 하러가기
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">
            첫 번째 댓글을 남겨보세요!
          </p>
        )}
      </div>
    </div>
  );
}
