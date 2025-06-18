<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function getNotifications()
    {
        try {
            $user = Auth::user();
            
            // Debug: Log user information
            Log::info('Notification request for user:', [
                'user_id' => $user->id,
                'user_role' => $user->role,
                'user_name' => $user->nama
            ]);
            
            $notifications = $user->notifications()
                ->orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $unreadCount = $user->notifications()
                ->where('is_read', false)
                ->count();

            // Debug: Log notification data
            Log::info('Notifications found:', [
                'count' => $notifications->count(),
                'unread_count' => $unreadCount,
                'notifications' => $notifications->toArray()
            ]);

            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            
            if ($notification->user_id === Auth::id()) {
                $notification->update(['is_read' => true]);
                return response()->json(['success' => true]);
            }

            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            Log::error('Error marking notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notification as read'], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            Auth::user()->notifications()
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error marking all notifications as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notifications as read'], 500);
        }
    }

    public function deleteNotification($id)
    {
        try {
            $notification = Notification::findOrFail($id);
            
            if ($notification->user_id === Auth::id()) {
                $notification->delete();
                return response()->json(['success' => true]);
            }

            return response()->json(['error' => 'Unauthorized'], 403);
        } catch (\Exception $e) {
            Log::error('Error deleting notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete notification'], 500);
        }
    }

    public function deleteAllNotifications()
    {
        try {
            Auth::user()->notifications()->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Error deleting all notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete all notifications'], 500);
        }
    }
} 