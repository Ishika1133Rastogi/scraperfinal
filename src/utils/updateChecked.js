const Base = require("../model/selector");

// code for update the isChecked value
const updateScrapedDataItem = async (itemId, isChecked) => {
  try {
    const result = await Base.findOneAndUpdate(
      { "scrapedData._id": itemId },
      {
        $set: {
          "scrapedData.$.isChecked": isChecked,
          "scrapedData.$.timestamp": isChecked ? Date.now() : null,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

module.exports = updateScrapedDataItem;
