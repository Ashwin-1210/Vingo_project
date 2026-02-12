import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    // 🔹 identity receive
    socket.on("identity", async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true },
        );

        // ✅ REQUIRED FIX → frontend ko confirm bhejo
        socket.emit("identity-success", { socketId: socket.id });

        console.log("✅ identity saved for:", userId);
      } catch (error) {
        console.log("identity error:", error);
      }
    });

    // 🔹 delivery boy live location
    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
          io.emit("updateDeliveryLocation", {
            deliveryBoyId: userId,
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.log("updateDeliveryLocation error");
      }
    });

    // 🔹 disconnect
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false },
        );

        console.log("❌ Disconnected:", socket.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};
